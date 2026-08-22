"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { EditorPanel } from "@/components/workspace/EditorPanel";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { useState } from "react";
import { useBackendConnection } from "@/hooks/useBackendConnection";
import { ProgressionInterface } from "@/components/workspace/ProgressionInterface";
import { useModeStore, WORKSPACE_MODES } from "@/store/mode-store";
import { SettingsModal } from "@/components/workspace/modals/SettingsModal";
import { AgentConfigModal } from "@/components/workspace/modals/AgentConfigModal";
import { DatabaseExplorerModal } from "@/components/workspace/modals/DatabaseExplorerModal";

export function WorkspaceApp() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [showDb, setShowDb] = useState(false);

  useBackendConnection();
  const activeMode = useModeStore((state) => state.activeMode);
  const modeData = WORKSPACE_MODES[activeMode];

  // 3D Spatial Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <main 
      className="noise relative h-screen w-screen overflow-hidden bg-black transition-colors duration-1000"
      style={{ boxShadow: `inset 0 0 150px ${modeData.accent}05` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <AmbientBackground />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at top right, ${modeData.accent}30, transparent 40%)` }}
      />
      <Particles />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 flex h-full w-full gap-6 p-6 pt-16 perspective-[2000px]"
      >
        <div className="absolute top-4 right-6 flex gap-3 translate-z-[80px]" style={{ transform: "translateZ(80px)" }}>
          <button onClick={() => setShowDb(true)} className="floating-btn glass px-4 py-2 rounded-full text-xs font-semibold text-emerald-400 hover:text-emerald-300">Supabase DB</button>
          <button onClick={() => setShowAgents(true)} className="floating-btn glass px-4 py-2 rounded-full text-xs font-semibold text-amber-core hover:text-amber-300">Agent Config</button>
          <button onClick={() => setShowSettings(true)} className="floating-btn glass px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 hover:text-white">API Keys</button>
        </div>
        <div className="w-[18%] flex-shrink-0 h-full flex translate-z-[20px]" style={{ transform: "translateZ(20px)" }}>
          <Sidebar />
        </div>
        <div className="flex h-full min-h-0 flex-col gap-6 flex-1 translate-z-[40px]" style={{ transform: "translateZ(40px)" }}>
          <div className="min-h-0 flex-[3] flex">
            <EditorPanel />
          </div>
          <div className="min-h-0 flex-[1] flex">
            <TerminalPanel />
          </div>
        </div>
        <div className="w-[30%] flex-shrink-0 h-full flex translate-z-[60px]" style={{ transform: "translateZ(60px)" }}>
          <ChatPanel />
        </div>
      </motion.div>
      <ProgressionInterface />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AgentConfigModal isOpen={showAgents} onClose={() => setShowAgents(false)} />
      <DatabaseExplorerModal isOpen={showDb} onClose={() => setShowDb(false)} />
    </main>
  );
}
