"use client";

import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { EditorPanel } from "@/components/workspace/EditorPanel";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { useBackendConnection } from "@/hooks/useBackendConnection";
import { ProgressionInterface } from "@/components/workspace/ProgressionInterface";
import { useModeStore, WORKSPACE_MODES } from "@/store/mode-store";

export function WorkspaceApp() {
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
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 grid h-full w-full grid-cols-1 lg:grid-cols-[18%_52%_30%]">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-[3]">
            <EditorPanel />
          </div>
          <div className="min-h-0 flex-[1]">
            <TerminalPanel />
          </div>
        </div>
        <ChatPanel />
      </motion.div>
      <ProgressionInterface />
    </main>
  );
}
