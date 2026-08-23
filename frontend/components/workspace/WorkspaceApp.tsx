"use client";

import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { EditorPanel } from "@/components/workspace/EditorPanel";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { PromptDock } from "@/components/workspace/PromptDock";
import { TopBar } from "@/components/workspace/TopBar";
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
    <main className="h-screen w-screen overflow-hidden bg-background text-primary flex flex-col font-sans">
      <TopBar />
      
      <div className="flex flex-1 min-h-0 overflow-hidden relative z-10">
        <Sidebar />
        
        <div className="flex-1 min-w-0 flex flex-col relative">
          <div className="flex-1 min-h-0 flex">
            <EditorPanel />
          </div>
          <TerminalPanel />
          <PromptDock />
        </div>
        
        <div className="w-[320px] flex-shrink-0 border-l border-subtle hidden lg:flex flex-col">
          <ChatPanel />
        </div>
      </div>

      <ProgressionInterface />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AgentConfigModal isOpen={showAgents} onClose={() => setShowAgents(false)} />
      <DatabaseExplorerModal isOpen={showDb} onClose={() => setShowDb(false)} />
      <IntegrationsModal isOpen={showIntegrations} onClose={() => setShowIntegrations(false)} />
      {showOnboarding && <ExperienceSelector onComplete={handleOnboardingComplete} />}
    </main>
  );
}
