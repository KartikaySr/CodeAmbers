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
    <aside className="glass floating-panel flex w-full h-full min-h-0 flex-col p-5">
      <Brand className="shrink-0" />
      <Panel className="mt-5 shrink-0 p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-amber-core text-sm font-bold text-black">
            {(user?.name || "O").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{user?.name ?? "CodeAmbers Operator"}</p><p className="truncate text-xs text-zinc-500">{workspaceName}</p></div>
        </div>
      </Panel>
      <div className="mt-5 space-y-1 relative">
        {initialNavItems.map((item) => {
          const isActive = activeNav === item.label;
          return (
            <button 
              key={item.label} 
              onClick={() => setActiveNav(item.label)} 
              className={cn("relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:text-white", isActive ? "text-amber-100" : "text-zinc-400 hover:bg-white/[0.06]")}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-lg bg-amber-core/10 border border-amber-core/20" />
              )}
              <item.icon className={cn("size-4 relative z-10", isActive && "text-amber-core")} />
              <span className="truncate relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* MODE SELECTOR */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
          Active Mode
          <button onClick={() => useModeStore.getState().toggleProgression()} className="text-amber-core hover:text-amber-300 transition-colors">
            {useModeStore.getState().showProgression ? 'Hide UI' : 'Show UI'}
          </button>
        </div>
        <Panel className="p-2 relative group cursor-pointer hover:border-amber-core/30 transition-colors">
          <select 
            className="w-full bg-transparent text-sm text-white outline-none cursor-pointer appearance-none"
            value={useModeStore.getState().activeMode}
            onChange={(e) => useModeStore.getState().setActiveMode(e.target.value as any)}
          >
            {Object.values(WORKSPACE_MODES).map((mode) => (
              <option key={mode.id} value={mode.id} className="bg-black text-white">{mode.name}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500 group-hover:text-amber-core transition-colors" />
        </Panel>
      </div>
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">Agents<span className={socketStatus === "connected" ? "text-emerald-300" : "text-amber-300"}>{socketStatus}</span></div>
        <div className="grid gap-3">{agents.map((agent) => <AgentCard key={agent.id} agent={agent} compact />)}</div>
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500"><FolderGit2 className="size-3.5" /> Repository</div>
          <Panel className="p-3">
            <div className="mb-3 flex items-center gap-2 text-sm text-white"><GitBranch className="size-4 text-amber-core" /> codeambers/v1</div>
            <div className="grid gap-1">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:bg-white/[0.05] cursor-pointer group">
                  <span className="truncate group-hover:text-white transition-colors">{file.path}</span>
                  <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
      <div className="mt-4 grid shrink-0 grid-cols-2 gap-2">
        <button className="floating-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-amber-core"><Bell className="size-3.5" /> 12</button>
        <button onClick={() => logout()} className="floating-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-red-400"><Settings className="size-3.5" /> Logout</button>
      </div>
    </aside>
  );
}
