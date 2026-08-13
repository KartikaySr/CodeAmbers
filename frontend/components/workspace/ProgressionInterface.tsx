"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModeStore, WORKSPACE_MODES } from "@/store/mode-store";
import { 
  Globe, Hexagon, Database, ShieldAlert, Cloud, Smartphone, 
  Gamepad2, Atom, Cpu, TrendingUp, BrainCircuit, X, Activity, ChevronRight
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";

const ICONS: Record<string, any> = {
  Globe, Hexagon, Database, ShieldAlert, Cloud, Smartphone,
  Gamepad2, Atom, Cpu, TrendingUp, BrainCircuit
};

export function ProgressionInterface() {
  const { activeMode, showProgression, toggleProgression } = useModeStore();
  const modeData = WORKSPACE_MODES[activeMode];
  const Icon = ICONS[modeData.icon] || Globe;

  if (!showProgression) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 300, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-6 right-6 z-50 w-96 shadow-2xl"
      >
        <div 
          className="overflow-hidden rounded-2xl border bg-black/60 backdrop-blur-2xl"
          style={{ borderColor: `${modeData.accent}30` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: `${modeData.accent}20`, backgroundColor: `${modeData.accent}05` }}>
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-md" style={{ backgroundColor: `${modeData.accent}15`, color: modeData.accent }}>
                <Icon className="size-4" />
              </div>
              <span className="text-sm font-semibold text-white">{modeData.name} Mode</span>
            </div>
            <button onClick={toggleProgression} className="text-zinc-500 hover:text-white transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Module Specific Content */}
          <div className="p-4">
            <h3 className="mb-4 text-xs uppercase tracking-widest text-zinc-500">{modeData.description}</h3>
            
            <ModuleContent mode={activeMode} accent={modeData.accent} />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Renders the specific UI for the selected mode (11 distinct modules)
function ModuleContent({ mode, accent }: { mode: string, accent: string }) {
  switch (mode) {
    case "web":
      return (
        <div className="grid gap-3">
          <Phase label="Build Next.js Bundle" progress={100} accent={accent} />
          <Phase label="Run Lint & Typecheck" progress={100} accent={accent} />
          <Phase label="Deploy to Vercel Edge" progress={45} accent={accent} active />
        </div>
      );
    case "web3":
      return (
        <div className="grid gap-3">
          <Phase label="Compile Solidity (v0.8.20)" progress={100} accent={accent} />
          <Phase label="Run Slither Security Audit" progress={100} accent={accent} />
          <Phase label="Estimate Gas (21,000 gwei)" progress={80} accent={accent} active />
        </div>
      );
    case "data":
      return (
        <div className="grid gap-3">
          <Phase label="Load Parquet Dataset" progress={100} accent={accent} />
          <Phase label="Normalize Features (StandardScaler)" progress={100} accent={accent} />
          <Phase label="Train Random Forest (Epoch 4/10)" progress={40} accent={accent} active />
        </div>
      );
    case "cyber":
      return (
        <div className="grid gap-3">
          <Phase label="Nmap Port Scan" progress={100} accent={accent} />
          <Phase label="DirBuster Subdomain Enum" progress={90} accent={accent} active />
          <Phase label="Metasploit Auto-Pwn" progress={0} accent={accent} />
        </div>
      );
    case "cloud":
      return (
        <div className="grid gap-3">
          <Phase label="Validate Terraform State" progress={100} accent={accent} />
          <Phase label="Plan Infrastructure Changes" progress={100} accent={accent} />
          <Phase label="Apply (Provisioning EKS Cluster)" progress={25} accent={accent} active />
        </div>
      );
    case "mobile":
      return (
        <div className="grid gap-3">
          <Phase label="Resolve CocoaPods" progress={100} accent={accent} />
          <Phase label="Build Xcode Archive" progress={65} accent={accent} active />
          <Phase label="Fastlane Deploy to TestFlight" progress={0} accent={accent} />
        </div>
      );
    case "game":
      return (
        <div className="grid gap-3">
          <Phase label="Bake Global Illumination" progress={100} accent={accent} />
          <Phase label="Compile HLSL Shaders" progress={100} accent={accent} />
          <Phase label="Build WebGL Payload" progress={85} accent={accent} active />
        </div>
      );
    case "quantum":
      return (
        <div className="grid gap-3">
          <Phase label="Initialize Qubits" progress={100} accent={accent} />
          <Phase label="Apply Hadamard Gates" progress={100} accent={accent} />
          <Phase label="Measure Entanglement State" progress={60} accent={accent} active />
        </div>
      );
    case "iot":
      return (
        <div className="grid gap-3">
          <Phase label="Compile C++ Firmware" progress={100} accent={accent} />
          <Phase label="Establish Serial Connection" progress={100} accent={accent} />
          <Phase label="Flash ESP32 via OTA" progress={12} accent={accent} active />
        </div>
      );
    case "fintech":
      return (
        <div className="grid gap-3">
          <Phase label="Fetch Historical OHLCV" progress={100} accent={accent} />
          <Phase label="Run Backtest (Sharpe 2.1)" progress={100} accent={accent} />
          <Phase label="Execute Paper Trade" progress={95} accent={accent} active />
        </div>
      );
    case "agi":
      return (
        <div className="grid gap-3">
          <Phase label="Spin up Multi-Agent Swarm" progress={100} accent={accent} />
          <Phase label="Establish Swarm Consensus" progress={100} accent={accent} />
          <Phase label="Synthesize Universal Truth" progress={77} accent={accent} active />
        </div>
      );
    default:
      return null;
  }
}

function Phase({ label, progress, accent, active }: { label: string, progress: number, accent: string, active?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className={active ? "text-white" : "text-zinc-500"}>{label}</span>
        <span style={{ color: active ? accent : undefined }} className={active ? "font-mono" : "text-zinc-600 font-mono"}>{progress}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div 
          className="h-full rounded-full" 
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
