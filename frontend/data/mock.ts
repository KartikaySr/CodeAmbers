import {
  Bell,
  Bot,
  Boxes,
  Braces,
  Cable,
  GitBranch,
  Home,
  Layers3,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap
} from "lucide-react";
import type { Agent, ChatMessage, NavItem, WorkspaceFile } from "@/types";

export const agents: Agent[] = [
  { id: "architect", name: "Architect Agent", callSign: "ARCHITECT", status: "thinking", specialty: "system design, dependency maps, scale planning", accent: "#f59e0b", load: 76 },
  { id: "backend", name: "Backend Agent", callSign: "BACKEND", status: "streaming", specialty: "APIs, queues, data models, auth boundaries", accent: "#22d3ee", load: 58 },
  { id: "frontend", name: "Frontend Agent", callSign: "FRONTEND", status: "online", specialty: "interfaces, motion, design systems", accent: "#a78bfa", load: 64 },
  { id: "security", name: "Security Agent", callSign: "SECURITY", status: "online", specialty: "threat models, secrets, policy enforcement", accent: "#34d399", load: 41 },
  { id: "devops", name: "DevOps Agent", callSign: "DEVOPS", status: "idle", specialty: "CI, previews, telemetry, rollout safety", accent: "#fb7185", load: 38 }
];

export const navItems: NavItem[] = [
  { label: "Command Center", href: "/workspace", icon: Home, active: true },
  { label: "Agent Swarm", href: "/workspace", icon: Bot },
  { label: "Architecture", href: "/workspace", icon: Boxes },
  { label: "Live Sessions", href: "/workspace", icon: Radio },
  { label: "Notifications", href: "/workspace", icon: Bell },
  { label: "Deployments", href: "/workspace", icon: Zap },
  { label: "Settings", href: "/workspace", icon: Settings }
];

export const featureCards = [
  { title: "Multi-Agent Engineering", icon: Sparkles, copy: "Delegate planning, frontend, backend, security, and DevOps to coordinated specialist agents." },
  { title: "Real-Time Streaming", icon: Radio, copy: "Watch reasoning, code, and architecture decisions stream into the workspace as they happen." },
  { title: "Voice Collaboration", icon: Cable, copy: "Prompt, interrupt, and steer engineering sessions with natural voice-ready controls." },
  { title: "Architecture Visualization", icon: Layers3, copy: "Turn product goals into dependency maps, service diagrams, and implementation plans." },
  { title: "Autonomous Refactoring", icon: Braces, copy: "Refactor large code surfaces with policy-aware agents and live review checkpoints." },
  { title: "Live Code Synchronization", icon: GitBranch, copy: "Keep AI edits, developer changes, and preview environments synchronized in one flow." },
  { title: "Security Guardrails", icon: ShieldCheck, copy: "Surface risky changes, auth gaps, data leaks, and compliance hazards before merge." },
  { title: "Terminal Native", icon: TerminalSquare, copy: "Blend terminal-like precision with immersive orchestration and visual observability." }
];

export const initialMessages: ChatMessage[] = [
  { id: "m1", author: "CodeAmbers", body: "Workspace initialized. Five agents online. Repository graph indexed from mock project context.", timestamp: "09:41", kind: "system" },
  { id: "m2", author: "You", body: "Design a production-ready task orchestration module with streaming agent updates.", timestamp: "09:42", kind: "user" },
  { id: "m3", agent: "architect", author: "ARCHITECT", body: "I am splitting the module into orchestration state, event transport, agent registry, and UI playback. The safest first slice is a typed event timeline that can replay every agent decision.", timestamp: "09:42", kind: "agent" }
];

export const files: WorkspaceFile[] = [
  {
    id: "file-1",
    name: "orchestrator.ts",
    path: "src/ai/orchestrator.ts",
    language: "typescript",
    content: `type AgentEvent = {
  id: string;
  agent: "architect" | "backend" | "frontend" | "security";
  phase: "plan" | "write" | "review" | "ship";
  payload: string;
  createdAt: number;
};

export class AgentOrchestrator {
  private timeline: AgentEvent[] = [];

  publish(event: AgentEvent) {
    this.timeline.push(event);
    return this.snapshot();
  }

  snapshot() {
    return [...this.timeline].sort((a, b) => a.createdAt - b.createdAt);
  }
}
`
  },
  {
    id: "file-2",
    name: "AgentConsole.tsx",
    path: "src/components/AgentConsole.tsx",
    language: "typescript",
    content: `export function AgentConsole() {
  return (
    <section className="agent-console">
      <header>Live Agent Timeline</header>
      <div data-stream="agent-events" />
    </section>
  );
}
`
  },
  {
    id: "file-3",
    name: "architecture.md",
    path: "docs/architecture.md",
    language: "markdown",
    content: `# CodeAmbers Mock Architecture

- Client-only orchestration loop
- Zustand workspace state
- Simulated stream transport
- Monaco-powered code surface
- Clerk-ready auth shells
`
  }
];

export const generatedCode = `type AgentEvent = {
  id: string;
  agent: "architect" | "backend" | "frontend" | "security" | "devops";
  phase: "plan" | "write" | "review" | "ship";
  payload: string;
  confidence: number;
  createdAt: number;
};

type Subscriber = (event: AgentEvent, timeline: AgentEvent[]) => void;

export class AgentOrchestrator {
  private timeline: AgentEvent[] = [];
  private subscribers = new Set<Subscriber>();

  subscribe(subscriber: Subscriber) {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  publish(event: AgentEvent) {
    this.timeline = [...this.timeline, event].sort((a, b) => a.createdAt - b.createdAt);
    for (const subscriber of this.subscribers) {
      subscriber(event, this.snapshot());
    }
    return this.snapshot();
  }

  snapshot() {
    return this.timeline.map((event) => ({ ...event }));
  }
}
`;
