"use client";

import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { EditorPanel } from "@/components/workspace/EditorPanel";
import { PreviewPanel } from "@/components/workspace/PreviewPanel";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { ExperienceSelector } from "@/components/onboarding/ExperienceSelector";
import { useEffect, useState } from "react";
import { useBackendConnection } from "@/hooks/useBackendConnection";
import { ProgressionInterface } from "@/components/workspace/ProgressionInterface";
import { useModeStore, WORKSPACE_MODES } from "@/store/mode-store";
import { SettingsModal } from "@/components/workspace/modals/SettingsModal";
import { AgentConfigModal } from "@/components/workspace/modals/AgentConfigModal";
import { DatabaseExplorerModal } from "@/components/workspace/modals/DatabaseExplorerModal";
import { IntegrationsModal } from "@/components/workspace/modals/IntegrationsModal";

export function WorkspaceApp() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [showDb, setShowDb] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasOnboarded = localStorage.getItem("codeambers_onboarded");
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleOnboardingComplete = (level: string) => {
    localStorage.setItem("codeambers_onboarded", "true");
    localStorage.setItem("codeambers_experience_level", level);
    setShowOnboarding(false);
  };

  useBackendConnection();
  const activeMode = useModeStore((state) => state.activeMode);
  const modeData = WORKSPACE_MODES[activeMode];

  return (
    <main 
      className="noise relative h-screen w-screen overflow-hidden bg-black transition-colors duration-1000"
      style={{ boxShadow: `inset 0 0 150px ${modeData.accent}03` }}
    >
      <AmbientBackground />
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at top right, ${modeData.accent}25, transparent 50%)` }}
      />
      <Particles />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="relative z-10 flex h-full w-full gap-5 p-5 pt-16"
      >
        <div className="absolute top-4 right-4 flex gap-3">
          <button onClick={() => setShowIntegrations(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-blue-400 hover:text-blue-300 border border-blue-500/20">Integrations / Export</button>
          <button onClick={() => setShowDb(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20">Supabase DB</button>
          <button onClick={() => setShowAgents(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-amber-core hover:text-amber-300 border border-amber-500/20">Agent Config</button>
          <button onClick={() => setShowSettings(true)} className="floating-btn glass px-4 py-2 rounded-md text-xs font-semibold text-zinc-300 hover:text-white border border-white/10">API Keys</button>
        </div>
        <div className="w-[260px] flex-shrink-0 h-full flex">
          <Sidebar />
        </div>
        <div className="flex h-full min-h-0 flex-col gap-5 flex-1">
          <div className="min-h-0 flex-[3] flex gap-5">
            <div className="flex-1 min-w-0">
              <EditorPanel />
            </div>
            <div className="flex-1 min-w-0">
              <PreviewPanel />
            </div>
          </div>
          <div className="min-h-0 flex-[1] flex">
            <TerminalPanel />
          </div>
        </div>
        <div className="w-[340px] flex-shrink-0 h-full flex">
          <ChatPanel />
        </div>
      </motion.div>
      <ProgressionInterface />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AgentConfigModal isOpen={showAgents} onClose={() => setShowAgents(false)} />
      <DatabaseExplorerModal isOpen={showDb} onClose={() => setShowDb(false)} />
      <IntegrationsModal isOpen={showIntegrations} onClose={() => setShowIntegrations(false)} />
      {showOnboarding && <ExperienceSelector onComplete={handleOnboardingComplete} />}
    </main>
  );
}
