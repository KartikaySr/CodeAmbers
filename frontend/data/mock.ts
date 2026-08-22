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
import type { Agent, NavItem } from "@/types";

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
