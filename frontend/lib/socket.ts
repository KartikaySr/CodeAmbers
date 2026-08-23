export type SocketStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";

export type ServerEvent =
  | { type: "CONNECTED"; clientId: string; workspaceId: string; stats?: unknown; sentAt?: string }
  | { type: "CHAT_CHUNK"; content: string; streamId?: string; sentAt?: string }
  | { type: "CODE_START"; file: string; language: string; streamId?: string; sentAt?: string }
  | { type: "CODE_CHUNK"; file: string; language?: string; content: string; streamId?: string; sentAt?: string }
  | { type: "CODE_END"; file: string; language: string; streamId?: string; sentAt?: string }
  | { type: "STREAM_START"; streamId: string; workspaceId?: string; sentAt?: string }
  | { type: "STREAM_END"; streamId: string; status: "completed" | "failed"; sentAt?: string }
  | { type: "WORKSPACE_PATCH"; file?: string; content?: string; sentAt?: string }
  | { type: "PROJECT_UPDATED"; file?: unknown; sentAt?: string }
  | { type: "AUTOCOMPLETE_RESULT"; content: string; sentAt?: string }
  | { type: "EXPLAIN_ERROR_RESULT"; content: string; sentAt?: string }
  | { type: "CODE_REVIEW_RESULT"; content: string; sentAt?: string }
  | { type: "ERROR"; code?: string; message: string; sentAt?: string }
  | { type: "PONG"; sentAt?: string };

type ClientEvent =
  | { type: "PING" }
  | { type: "AI_PROMPT"; prompt: string; workspaceId: string; activeFile?: string; mode: "chat" | "code" | "architecture" | "review" | "architect" | "frontend" | "backend" | "security" | "devops"; apiKey?: string }
  | { type: "AI_AUTOCOMPLETE"; prefix: string; suffix: string }
  | { type: "AI_EXPLAIN_ERROR"; errorOutput: string }
  | { type: "AI_CODE_REVIEW"; fileContent: string }
  | { type: "WORKSPACE_PATCH"; workspaceId: string; file: { path: string; name: string; language: string; content: string } };

type Listener = (event: ServerEvent) => void;
type StatusListener = (status: SocketStatus) => void;

class CodeAmbersSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private workspaceId = "global";
  private manualClose = false;
  status: SocketStatus = "idle";

  connect(workspaceId: string) {
    if (this.ws && this.workspaceId !== workspaceId && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
      this.ws = null;
    }
    this.workspaceId = workspaceId || "global";
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    this.manualClose = false;
    this.setStatus(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");

    const baseUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";
    const token = window.localStorage.getItem("codeambers.accessToken");
    const url = new URL(baseUrl);
    url.searchParams.set("workspaceId", this.workspaceId);
    if (token) url.searchParams.set("token", token);

    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("connected");
      this.startHeartbeat();
    };

    this.ws.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as ServerEvent;
        this.listeners.forEach((listener) => listener(event));
      } catch {
        this.listeners.forEach((listener) => listener({ type: "ERROR", code: "BAD_SOCKET_PAYLOAD", message: "Received invalid websocket payload." }));
      }
    };

    this.ws.onerror = () => this.setStatus("error");
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.ws = null;
      if (this.manualClose) {
        this.setStatus("disconnected");
        return;
      }
      this.scheduleReconnect();
    };
  }

  disconnect() {
    this.manualClose = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.setStatus("disconnected");
  }

  send(event: ClientEvent) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.connect(this.workspaceId);
      return false;
    }
    this.ws.send(JSON.stringify(event));
    return true;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => { this.statusListeners.delete(listener); };
  }

  private setStatus(status: SocketStatus) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  private scheduleReconnect() {
    this.reconnectAttempts += 1;
    this.setStatus("reconnecting");
    const delay = Math.min(1000 * 2 ** (this.reconnectAttempts - 1), 15000);
    this.reconnectTimer = window.setTimeout(() => this.connect(this.workspaceId), delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingTimer = window.setInterval(() => this.send({ type: "PING" }), 25000);
  }

  private stopHeartbeat() {
    if (this.pingTimer) window.clearInterval(this.pingTimer);
    this.pingTimer = null;
  }
}

export const codeAmbersSocket = new CodeAmbersSocket();
