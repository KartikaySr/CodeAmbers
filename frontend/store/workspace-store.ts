"use client";

import { create } from "zustand";
import { api, clearAuthTokens, getStoredUser, persistAuthTokens, type AuthResult } from "@/lib/api";
import { nowLabel, uid } from "@/lib/utils";
import type { AgentRole, ChatMessage, WorkspaceFile } from "@/types";

const seedFiles: WorkspaceFile[] = [];
const initialMessages: ChatMessage[] = [];

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";

type WorkspaceRecord = {
  id: string;
  name: string;
  files?: WorkspaceFile[];
};

type AuthUser = AuthResult["user"];

type WorkspaceState = {
  files: WorkspaceFile[];
  activeFileId: string | null;
  messages: ChatMessage[];
  activeAgents: AgentRole[];
  streaming: boolean;
  socketStatus: ConnectionStatus;
  backendStatus: "unknown" | "online" | "offline";
  error: string | null;
  workspaceId: string;
  workspaceName: string;
  workspaces: WorkspaceRecord[];
  user: AuthUser | null;
  authLoading: boolean;
  activeStreamMessageId: string | null;
  activeCodeFiles: Record<string, string>;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string, options?: { persist?: boolean }) => void;
  appendFileChunk: (path: string, content: string, language?: string) => void;
  resetStreamingFile: (path: string, language?: string) => void;
  appendMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, body: string, streaming?: boolean) => void;
  appendChatChunk: (content: string) => void;
  finishStream: () => void;
  setStreaming: (streaming: boolean) => void;
  setSocketStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  loadWorkspace: () => Promise<void>;
  syncFile: (file: WorkspaceFile) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrateSession: () => Promise<void>;
};

const fileSyncTimers = new Map<string, number>();

function normalizeFile(file: Partial<WorkspaceFile>, fallbackPath = "generated.ts"): WorkspaceFile {
  const path = file.path ?? fallbackPath;
  return {
    id: file.id ?? `file-${path}`,
    name: file.name ?? path.split("/").at(-1) ?? path,
    path,
    language: file.language ?? "typescript",
    content: file.content ?? "",
    dirty: file.dirty
  };
}

function agentFromChunk(content: string): AgentRole | null {
  const match = content.match(/\[(ARCHITECT|BACKEND|FRONTEND|SECURITY|DEVOPS)\]/);
  if (!match) return null;
  return match[1].toLowerCase() as AgentRole;
}

function stripAgentLabel(content: string) {
  return content.replace(/\[(ARCHITECT|BACKEND|FRONTEND|SECURITY|DEVOPS)\]\s*/g, "");
}

function scheduleFileSync(get: () => WorkspaceState, file: WorkspaceFile) {
  const key = file.path;
  const existing = fileSyncTimers.get(key);
  if (existing) window.clearTimeout(existing);
  const timer = window.setTimeout(() => {
    get().syncFile(file).catch((error) => get().setError(error.message));
    fileSyncTimers.delete(key);
  }, 800);
  fileSyncTimers.set(key, timer);
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  files: seedFiles,
  activeFileId: null,
  messages: initialMessages,
  activeAgents: ["architect", "backend", "security"],
  streaming: false,
  socketStatus: "idle",
  backendStatus: "unknown",
  error: null,
  workspaceId: "global",
  workspaceName: "CodeAmbers Demo Workspace",
  workspaces: [],
  user: null,
  authLoading: false,
  activeStreamMessageId: null,
  activeCodeFiles: {},

  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content, options = { persist: true }) =>
    set((state) => {
      let changedFile: WorkspaceFile | null = null;
      const files = state.files.map((file) => {
        if (file.id !== id) return file;
        changedFile = { ...file, content, dirty: true };
        return changedFile;
      });
      if (changedFile && options.persist !== false) scheduleFileSync(get, changedFile);
      return { files };
    }),
  appendFileChunk: (path, content, language = "typescript") =>
    set((state) => {
      const existing = state.files.find((file) => file.path === path || file.name === path);
      const file = existing ?? normalizeFile({ path, language });
      const nextFile = { ...file, content: `${file.content}${content}`, language, dirty: true };
      const files = existing
        ? state.files.map((candidate) => (candidate.id === existing.id ? nextFile : candidate))
        : [...state.files, nextFile];
      scheduleFileSync(get, nextFile);
      return { files, activeFileId: nextFile.id };
    }),
  resetStreamingFile: (path, language = "typescript") =>
    set((state) => {
      const existing = state.files.find((file) => file.path === path || file.name === path);
      const file = normalizeFile(existing ?? { path, language }, path);
      const nextFile = { ...file, content: "", language, dirty: true };
      const files = existing
        ? state.files.map((candidate) => (candidate.id === existing.id ? nextFile : candidate))
        : [...state.files, nextFile];
      return { files, activeFileId: nextFile.id };
    }),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, body, streaming) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === id ? { ...message, body, streaming } : message))
    })),
  appendChatChunk: (content) =>
    set((state) => {
      const agent = agentFromChunk(content);
      const cleanContent = stripAgentLabel(content);
      const shouldStartMessage = agent && state.messages.find((message) => message.id === state.activeStreamMessageId)?.agent !== agent;
      const activeId = shouldStartMessage ? null : state.activeStreamMessageId;
      const existing = activeId ? state.messages.find((message) => message.id === activeId) : null;

      if (!existing) {
        const id = uid("agent");
        return {
          activeStreamMessageId: id,
          messages: [
            ...state.messages,
            {
              id,
              agent: agent ?? "architect",
              author: (agent ?? "architect").toUpperCase(),
              body: cleanContent,
              timestamp: nowLabel(),
              streaming: true,
              kind: "agent"
            }
          ]
        };
      }

      return {
        messages: state.messages.map((message) =>
          message.id === existing.id ? { ...message, body: `${message.body}${cleanContent}`, streaming: true } : message
        )
      };
    }),
  finishStream: () =>
    set((state) => ({
      streaming: false,
      activeStreamMessageId: null,
      messages: state.messages.map((message) =>
        message.id === state.activeStreamMessageId ? { ...message, streaming: false } : message
      )
    })),
  setStreaming: (streaming) => set({ streaming }),
  setSocketStatus: (socketStatus) => set({ socketStatus }),
  setError: (error) => set({ error }),

  loadWorkspace: async () => {
    try {
      await api.health();
      const { workspaces } = await api.listWorkspaces();
      let workspace = workspaces[0];
      if (!workspace) workspace = (await api.createWorkspace("CodeAmbers Demo Workspace")).workspace;
      const loadedFiles = workspace.files?.length ? workspace.files.map((file) => normalizeFile(file)) : seedFiles;
      set({
        backendStatus: "online",
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        workspaces,
        files: loadedFiles,
        activeFileId: loadedFiles[0]?.id ?? null,
        error: null
      });

      if (!workspace.files?.length) {
        await Promise.all(seedFiles.map((file) => api.upsertFile(workspace.id, file)));
      }
    } catch (error) {
      set({
        backendStatus: "offline",
        error: error instanceof Error ? error.message : "Backend unavailable. Using local workspace cache."
      });
    }
  },
  syncFile: async (file) => {
    const { workspaceId } = get();
    if (workspaceId === "global") return;
    await api.upsertFile(workspaceId, file);
  },
  login: async (email, password) => {
    set({ authLoading: true, error: null });
    try {
      const result = await api.login({ email, password });
      persistAuthTokens(result);
      set({ user: result.user, authLoading: false });
    } catch (error) {
      set({ authLoading: false, error: error instanceof Error ? error.message : "Login failed." });
      throw error;
    }
  },
  signup: async (name, email, password) => {
    set({ authLoading: true, error: null });
    try {
      const result = await api.signup({ name, email, password });
      persistAuthTokens(result);
      set({ user: result.user, authLoading: false });
    } catch (error) {
      set({ authLoading: false, error: error instanceof Error ? error.message : "Signup failed." });
      throw error;
    }
  },
  logout: async () => {
    await api.logout().catch(() => null);
    clearAuthTokens();
    set({ user: null });
  },
  hydrateSession: async () => {
    const user = getStoredUser();
    if (user) set({ user });
    try {
      const result = await api.me();
      set({ user: result.user });
    } catch {
      // Local JWT fallback remains usable until it expires; Clerk will replace this path later.
    }
  }
}));
