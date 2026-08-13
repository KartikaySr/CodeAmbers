"use client";

import { motion } from "framer-motion";
import { Panel } from "@/components/ui/Panel";

const lines = [
  "$ codeambers ignite --repo nova-platform",
  "[ARCHITECT] mapping service graph...",
  "[BACKEND] streaming event transport...",
  "[SECURITY] checking auth boundary...",
  "[FRONTEND] composing live workspace..."
];

export function HeroTerminal() {
  return (
    <Panel className="mx-auto mt-12 max-w-4xl p-4 text-left">
      <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-amber-core/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-zinc-500">autonomous-session.log</span>
      </div>
      <div className="grid gap-2 font-mono text-sm text-zinc-300">
        {lines.map((line, index) => (
          <motion.div key={line} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.22 }} className={index === 0 ? "text-amber-core" : ""}>
            {line}
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
