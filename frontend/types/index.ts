import type { LucideIcon } from "lucide-react";

export type AgentRole = "architect" | "backend" | "frontend" | "security" | "devops";

export type Agent = {
  id: AgentRole;
  name: string;
  callSign: string;
  status: "online" | "thinking" | "streaming" | "idle";
  specialty: string;
  accent: string;
  load: number;
};

export type ChatMessage = {
  id: string;
  agent?: AgentRole;
  author: string;
  body: string;
  timestamp: string;
  streaming?: boolean;
  kind?: "user" | "agent" | "system";
};

export type WorkspaceFile = {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  dirty?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};
