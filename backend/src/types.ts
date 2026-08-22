export type AgentRole = "architect" | "backend" | "frontend" | "security" | "devops";

export type WorkspaceFile = {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
};

export type ChatMessage = {
  id: string;
  agent?: AgentRole;
  author: string;
  body: string;
  timestamp: string;
  kind?: "user" | "agent" | "system";
};
