"use client";

import { Terminal, Lightbulb, Sparkles, X } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useState, useEffect } from "react";
import { codeAmbersSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";

export function TerminalPanel() {
  const { backendStatus } = useWorkspace();
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = codeAmbersSocket.subscribe((event) => {
      if (event.type === "EXPLAIN_ERROR_RESULT") {
        setAiExplanation(event.content);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const explainError = () => {
    setLoading(true);
    codeAmbersSocket.send({ type: "AI_EXPLAIN_ERROR", errorOutput: "Error: Cannot find module 'react'. Require stack: - /app/index.js" });
  };

  const suggestCommand = () => {
    setLoading(true);
    codeAmbersSocket.send({ type: "AI_EXPLAIN_ERROR", errorOutput: "Suggest a command to install react and react-dom using npm." });
  };
  
  return (
    <section className="glass floating-panel flex h-full min-h-0 w-full flex-col overflow-hidden relative">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-2 bg-black/30">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-amber-core/80" />
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 drop-shadow-sm">Terminal Output</p>
        </div>
        <div className="flex gap-2">
          <button onClick={suggestCommand} disabled={loading} className="floating-btn flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-300 hover:text-white">
            <Lightbulb className="size-3 text-amber-200" /> Suggest Command
          </button>
          <button onClick={explainError} disabled={loading} className="floating-btn flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-200 hover:text-red-100">
            <Sparkles className="size-3" /> Explain Error
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-400 relative">
        <div className="mb-2 flex items-center gap-2 text-zinc-600">
          <span>~</span>
          <span className="text-zinc-500">➜</span>
          <span className="text-emerald-400/70">codeambers</span>
        </div>
        <div>
          {backendStatus === "online" ? (
            <span className="text-emerald-400">Connected to secure runtime environment.</span>
          ) : (
            <span className="text-amber-500/80">Local development mode. Backend offline. Executing in local sandbox cache...</span>
          )}
        </div>
        <div className="mt-4 text-red-400/80">Error: Cannot find module 'react'.</div>
        <div className="mt-1 text-red-400/80">Require stack:</div>
        <div className="mt-1 text-red-400/80">- /app/index.js</div>
        <div className="mt-4 animate-pulse">_</div>
      </div>
      
      <AnimatePresence>
        {(aiExplanation || loading) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-amber-core/30 rounded-lg p-4 shadow-2xl z-10"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-amber-core text-sm font-semibold">
                <Sparkles className="size-4" /> AI DevOps Assistant
              </div>
              <button onClick={() => setAiExplanation(null)} className="text-zinc-500 hover:text-white"><X className="size-4"/></button>
            </div>
            {loading ? (
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <div className="size-2 bg-amber-core rounded-full animate-ping" /> Analyzing output...
              </div>
            ) : (
              <div className="text-sm text-zinc-200 leading-relaxed font-sans">
                {aiExplanation}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
