"use client";

import { Terminal, Lightbulb, Sparkles, X, Plus, Maximize2 } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useState, useEffect } from "react";
import { codeAmbersSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TerminalPanel() {
  const { backendStatus, activeFile } = useWorkspace();
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<{type: 'system'|'stdout'|'stderr', text: string}[]>([
    { type: 'system', text: 'Terminal initialized. Ready for command execution.' }
  ]);
  const [executing, setExecuting] = useState(false);
  const [terminals, setTerminals] = useState([{id: 1, name: "node server"}, {id: 2, name: "bash"}]);
  const [activeTerminal, setActiveTerminal] = useState(1);

  useEffect(() => {
    const unsub = codeAmbersSocket.subscribe((event) => {
      if (event.type === "EXPLAIN_ERROR_RESULT") {
        setAiExplanation(event.content);
        setLoading(false);
      }
    });
    return () => { unsub(); };
  }, []);

  const explainError = () => {
    setLoading(true);
    codeAmbersSocket.send({ type: "AI_EXPLAIN_ERROR", errorOutput: "Error: Cannot find module 'react'. Require stack: - /app/index.js" });
  };

  const suggestCommand = () => {
    setLoading(true);
    codeAmbersSocket.send({ type: "AI_EXPLAIN_ERROR", errorOutput: "Suggest a command to install react and react-dom using npm." });
  };
  
  const handleExecuteCode = async () => {
    if (!activeFile || !activeFile.content) return;
    
    setExecuting(true);
    setTerminalOutput(prev => [...prev, { type: 'system', text: `> Executing ${activeFile.name}...` }]);
    
    try {
      // Map Monaco languages to Piston API languages
      let pistonLanguage = activeFile.language;
      let pistonVersion = '*';
      
      const langMap: Record<string, {lang: string, version: string}> = {
        'javascript': { lang: 'javascript', version: '18.15.0' },
        'typescript': { lang: 'typescript', version: '5.0.3' },
        'python': { lang: 'python', version: '3.10.0' },
        'java': { lang: 'java', version: '15.0.2' },
        'c': { lang: 'c', version: '10.2.0' },
        'cpp': { lang: 'cpp', version: '10.2.0' },
        'ruby': { lang: 'ruby', version: '3.0.1' },
        'swift': { lang: 'swift', version: '5.3.3' }
      };
      
      if (langMap[activeFile.language]) {
        pistonLanguage = langMap[activeFile.language].lang;
        pistonVersion = langMap[activeFile.language].version;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_WS_URL?.replace('ws://', 'http://').replace('wss://', 'https://').replace('/ws', '') || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pistonLanguage,
          version: pistonVersion,
          code: activeFile.content
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        setTerminalOutput(prev => [...prev, { type: 'stderr', text: result.error }]);
      } else if (result.run) {
        if (result.run.stdout) setTerminalOutput(prev => [...prev, { type: 'stdout', text: result.run.stdout }]);
        if (result.run.stderr) setTerminalOutput(prev => [...prev, { type: 'stderr', text: result.run.stderr }]);
        setTerminalOutput(prev => [...prev, { type: 'system', text: `> Process exited with code ${result.run.code}` }]);
      }
    } catch (err) {
      console.error(err);
      setTerminalOutput(prev => [...prev, { type: 'stderr', text: 'Failed to connect to execution engine.' }]);
    } finally {
      setExecuting(false);
    }
  };
  
  return (
    <section className="flex h-[240px] w-full flex-col overflow-hidden bg-[#0A0A0A] border-t border-subtle">
      <div className="flex shrink-0 items-center justify-between border-b border-subtle bg-surface-workspace px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {terminals.map((t) => (
              <button key={t.id} onClick={() => setActiveTerminal(t.id)} className={cn("rounded-md px-3 py-1 text-[11px] font-medium transition-colors", activeTerminal === t.id ? "bg-white/[0.08] text-primary" : "text-muted hover:bg-white/[0.04] hover:text-secondary")}>
                {t.name}
              </button>
            ))}
          </div>
          <button className="grid size-6 place-items-center rounded-md text-muted hover:bg-white/[0.06] hover:text-secondary">
            <Plus className="size-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExecuteCode} disabled={executing || !activeFile} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 hover:text-emerald-100 disabled:opacity-50">
            <Terminal className="size-3" /> {executing ? "Running..." : "Run"}
          </button>
          <button onClick={suggestCommand} disabled={loading} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-300 hover:text-white">
            <Lightbulb className="size-3 text-amber-200" /> Suggest
          </button>
          <button onClick={explainError} disabled={loading} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-200 hover:text-red-100">
            <Sparkles className="size-3" /> Explain
          </button>
          <button className="grid size-6 place-items-center rounded-md text-muted hover:bg-white/[0.06] hover:text-secondary"><Maximize2 className="size-3.5" /></button>
          <button className="grid size-6 place-items-center rounded-md text-muted hover:bg-white/[0.06] hover:text-error"><X className="size-3.5" /></button>
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
            <span className="text-emerald-400">Connected to secure runtime environment. Multi-language execution enabled.</span>
          ) : (
            <span className="text-amber-500/80">Local development mode. Backend offline. Executing in local sandbox cache...</span>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {terminalOutput.map((out, i) => (
            <div key={i} className={out.type === 'stderr' ? 'text-red-400/90 whitespace-pre-wrap' : out.type === 'stdout' ? 'text-zinc-300 whitespace-pre-wrap' : 'text-blue-400/80 whitespace-pre-wrap'}>
              {out.text}
            </div>
          ))}
        </div>
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
