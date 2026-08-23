"use client";

import { Bell, ChevronRight, FolderGit2, GitBranch, Settings } from "lucide-react";
import { agents, navItems as initialNavItems } from "@/data/mock";
import { AgentCard } from "@/components/agents/AgentCard";
import { Brand } from "@/components/ui/Brand";
import { useModeStore, WORKSPACE_MODES } from "@/store/mode-store";
import { Panel } from "@/components/ui/Panel";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

export function Sidebar() {
  const { files, workspaceName, user, logout, socketStatus } = useWorkspace();
  const [activeNav, setActiveNav] = useState(initialNavItems.find(i => i.active)?.label || initialNavItems[0].label);

  return (
    <aside className="glass floating-panel flex w-full h-full min-h-0 flex-col p-6">
      <Brand className="shrink-0" />
      <div className="mt-6 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-white shadow-md">
            {(user?.name || "O").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">{user?.name ?? "CodeAmbers Operator"}</p>
            <p className="truncate text-xs font-medium text-zinc-500">{workspaceName}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-1 relative">
        {initialNavItems.map((item) => {
          const isActive = activeNav === item.label;
          return (
            <button 
              key={item.label} 
              onClick={() => setActiveNav(item.label)} 
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group", 
                isActive ? "text-amber-50" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/5 border border-amber-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-lg bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
              <item.icon className={cn("size-4 relative z-10 transition-colors duration-200", isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              <span className="truncate relative z-10 tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* MODE SELECTOR */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Active Mode
          <button onClick={() => useModeStore.getState().toggleProgression()} className="text-amber-500 hover:text-amber-400 transition-colors">
            {useModeStore.getState().showProgression ? 'Hide UI' : 'Show UI'}
          </button>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2 relative group cursor-pointer hover:border-amber-500/30 transition-all duration-300">
          <select 
            className="w-full bg-transparent text-sm font-medium text-zinc-200 outline-none cursor-pointer appearance-none px-2"
            value={useModeStore.getState().activeMode}
            onChange={(e) => useModeStore.getState().setActiveMode(e.target.value as any)}
          >
            {Object.values(WORKSPACE_MODES).map((mode) => (
              <option key={mode.id} value={mode.id} className="bg-[#09090b] text-zinc-200">{mode.name}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500 group-hover:text-amber-400 transition-colors" />
        </div>
      </div>
      <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Agents<span className={socketStatus === "connected" ? "text-emerald-400" : "text-amber-400"}>{socketStatus}</span></div>
        <div className="grid gap-3">{agents.map((agent) => <AgentCard key={agent.id} agent={agent} compact />)}</div>
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500"><FolderGit2 className="size-3.5" /> Repository</div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 shadow-inner">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200"><GitBranch className="size-4 text-amber-500" /> codeambers/v1</div>
            <div className="grid gap-1">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 cursor-pointer group transition-colors">
                  <span className="truncate">{file.path}</span>
                  <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid shrink-0 grid-cols-2 gap-2">
        <button className="floating-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-amber-core"><Bell className="size-3.5" /> 12</button>
        <button onClick={() => logout()} className="floating-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-red-400"><Settings className="size-3.5" /> Logout</button>
      </div>
    </aside>
  );
}
