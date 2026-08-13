"use client";

import { create } from "zustand";
import { files, initialMessages } from "@/data/mock";
import type { AgentRole, ChatMessage, WorkspaceFile } from "@/types";

type WorkspaceState = {
  files: WorkspaceFile[];
  activeFileId: string;
  messages: ChatMessage[];
  activeAgents: AgentRole[];
  streaming: boolean;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  appendMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, body: string, streaming?: boolean) => void;
  setStreaming: (streaming: boolean) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  files,
  activeFileId: files[0].id,
  messages: initialMessages,
  activeAgents: ["architect", "backend", "security"],
  streaming: false,
  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) => file.id === id ? { ...file, content, dirty: true } : file)
    })),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, body, streaming) =>
    set((state) => ({
      messages: state.messages.map((message) => message.id === id ? { ...message, body, streaming } : message)
    })),
  setStreaming: (streaming) => set({ streaming })
}));
