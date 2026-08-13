"use client";

import { Terminal } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";

export function TerminalPanel() {
  const { backendStatus } = useWorkspace();
  
  return (
    <section className="flex h-full flex-col bg-[#020202] border-t border-white/5">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-2 bg-[#050505]">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-zinc-500" />
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Terminal Output</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-400">
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
        <div className="mt-4 animate-pulse">_</div>
      </div>
    </section>
  );
}
