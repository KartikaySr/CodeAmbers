import type { WorkspaceFile } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type RequestOptions = RequestInit & {
  retries?: number;
};

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, status: number, code = "API_ERROR", details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { retries = 1, headers, ...init } = options;
  const token = typeof window !== "undefined" ? window.localStorage.getItem("codeambers.accessToken") : null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers
        }
      });

      const envelope = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
      if (!response.ok || envelope.success === false) {
        throw new ApiError(
          envelope.error?.message ?? response.statusText,
          response.status,
          envelope.error?.code,
          envelope.error?.details
        );
      }

      return envelope.data;
    } catch (error) {
      if (attempt >= retries) throw error;
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
    }
  }

  throw new ApiError("Request failed.", 500);
}

export type AuthResult = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    provider: string;
  };
  accessToken: string;
  refreshToken: string;
};

type BackendWorkspace = {
  id: string;
  name: string;
  files?: WorkspaceFile[];
  ownerId?: string;
  owner_id?: string;
  updatedAt?: string;
  updated_at?: string;
};

export const api = {
  health: () => request<{ status: string; aiConfigured: boolean; supabaseConfigured: boolean }>("/health"),
  signup: (body: { name: string; email: string; password: string }) =>
    request<AuthResult>("/auth/signup", { method: "POST", body: JSON.stringify(body), retries: 0 }),
  login: (body: { email: string; password: string }) =>
    request<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify(body), retries: 0 }),
  logout: () => request<{ loggedOut: boolean }>("/auth/logout", { method: "POST", retries: 0 }),
  me: () => request<{ user: AuthResult["user"] }>("/auth/me", { retries: 0 }),
  listWorkspaces: () => request<{ workspaces: BackendWorkspace[] }>("/workspaces"),
  createWorkspace: (name: string) =>
    request<{ workspace: BackendWorkspace }>("/workspaces", { method: "POST", body: JSON.stringify({ name }) }),
  getWorkspace: (id: string) => request<{ workspace: BackendWorkspace }>(`/workspaces/${id}`),
  upsertFile: (workspaceId: string, file: WorkspaceFile) =>
    request<{ file: WorkspaceFile }>(`/workspaces/${workspaceId}/files`, {
      method: "PUT",
      body: JSON.stringify({
        path: file.path,
        name: file.name,
        language: file.language,
        content: file.content
      }),
      retries: 0
    })
};

export function persistAuthTokens(result: AuthResult) {
  window.localStorage.setItem("codeambers.accessToken", result.accessToken);
  window.localStorage.setItem("codeambers.refreshToken", result.refreshToken);
  window.localStorage.setItem("codeambers.user", JSON.stringify(result.user));
}

export function clearAuthTokens() {
  window.localStorage.removeItem("codeambers.accessToken");
  window.localStorage.removeItem("codeambers.refreshToken");
  window.localStorage.removeItem("codeambers.user");
}

export function getStoredUser(): AuthResult["user"] | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("codeambers.user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResult["user"];
  } catch {
    return null;
  }
}
