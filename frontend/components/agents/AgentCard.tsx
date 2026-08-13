"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import type { Agent } from "@/types";

export function AgentCard({ agent, compact = false }: { agent: Agent; compact?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="glass relative overflow-hidden rounded-lg p-4">
      <div className="absolute -right-10 -top-10 size-28 rounded-full blur-3xl" style={{ background: `${agent.accent}33` }} />
      <div className="relative flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg border bg-white/[0.04]" style={{ borderColor: `${agent.accent}55`, boxShadow: `0 0 32px ${agent.accent}22` }}>
          <Bot className="size-5" style={{ color: agent.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-white">{agent.name}</h3>
            <motion.span className="size-2 rounded-full" style={{ background: agent.accent }} animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.25, 0.85] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{agent.status}</p>
          {!compact && <p className="mt-3 text-sm leading-6 text-zinc-400">{agent.specialty}</p>}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div className="h-full rounded-full" style={{ background: agent.accent }} initial={{ width: 0 }} whileInView={{ width: `${agent.load}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
