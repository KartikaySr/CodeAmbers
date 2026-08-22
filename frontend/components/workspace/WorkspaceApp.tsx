"use client";

import { motion } from "framer-motion";
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

  return (
    <main 
      className="noise relative h-screen w-screen overflow-hidden bg-black transition-colors duration-1000"
      style={{ boxShadow: `inset 0 0 150px ${modeData.accent}05` }}
    >
      <AmbientBackground />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at top right, ${modeData.accent}30, transparent 40%)` }}
      />
      <Particles />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="relative z-10 flex h-full w-full gap-4 p-4 pt-16"
      >
        <div className="absolute top-4 right-4 flex gap-3">
          <button onClick={() => setShowDb(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20">Supabase DB</button>
          <button onClick={() => setShowAgents(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-amber-core hover:text-amber-300 border border-amber-500/20">Agent Config</button>
          <button onClick={() => setShowSettings(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-zinc-300 hover:text-white border border-white/10">API Keys</button>
        </div>
        <div className="w-[240px] flex-shrink-0 h-full flex">
          <Sidebar />
        </div>
        <div className="flex h-full min-h-0 flex-col gap-4 flex-1">
          <div className="min-h-0 flex-[3] flex">
            <EditorPanel />
          </div>
          <div className="min-h-0 flex-[1] flex">
            <TerminalPanel />
          </div>
        </div>
        <div className="w-[320px] flex-shrink-0 h-full flex">
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
