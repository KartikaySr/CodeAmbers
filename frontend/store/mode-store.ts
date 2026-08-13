import { create } from "zustand";

export type ModeId = 
  | "web" | "web3" | "data" | "cyber" 
  | "cloud" | "mobile" | "game" | "quantum" 
  | "iot" | "fintech" | "agi";

export interface WorkspaceMode {
  id: ModeId;
  name: string;
  accent: string; // Tailwind hex or class color for dynamic theming
  icon: string;   // Lucide icon name
  description: string;
}

export const WORKSPACE_MODES: Record<ModeId, WorkspaceMode> = {
  web: { id: "web", name: "Web Architecture", accent: "#f59e0b", icon: "Globe", description: "CI/CD Pipeline & Lighthouse" },
  web3: { id: "web3", name: "Smart Contract", accent: "#8b5cf6", icon: "Hexagon", description: "Gas & Testnet Metrics" },
  data: { id: "data", name: "Data Science", accent: "#3b82f6", icon: "Database", description: "Model Epochs & Loss" },
  cyber: { id: "cyber", name: "Cyber Security", accent: "#10b981", icon: "ShieldAlert", description: "Vulnerability Radar" },
  cloud: { id: "cloud", name: "Cloud DevOps", accent: "#0ea5e9", icon: "Cloud", description: "Topology & Terraform" },
  mobile: { id: "mobile", name: "Mobile App", accent: "#ec4899", icon: "Smartphone", description: "Build Matrix & Emulators" },
  game: { id: "game", name: "Game Engine", accent: "#ef4444", icon: "Gamepad2", description: "Render Pipeline & Shaders" },
  quantum: { id: "quantum", name: "Quantum Computing", accent: "#6366f1", icon: "Atom", description: "Qubit Entanglement" },
  iot: { id: "iot", name: "IoT Embedded", accent: "#f97316", icon: "Cpu", description: "Device Telemetry & OTA" },
  fintech: { id: "fintech", name: "FinTech Algo", accent: "#14b8a6", icon: "TrendingUp", description: "Latency & Backtesting" },
  agi: { id: "agi", name: "AGI Orchestration", accent: "#d946ef", icon: "BrainCircuit", description: "Neural Path & Consensus" },
};

interface ModeState {
  activeMode: ModeId;
  showProgression: boolean;
  setActiveMode: (mode: ModeId) => void;
  toggleProgression: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  activeMode: "web",
  showProgression: false,
  setActiveMode: (mode) => set({ activeMode: mode }),
  toggleProgression: () => set((state) => ({ showProgression: !state.showProgression })),
}));
