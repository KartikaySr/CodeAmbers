"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.04] px-3 py-2 text-xs text-zinc-400">
      <span>Agents thinking</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span key={dot} className="size-1.5 rounded-full bg-amber-core" animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }} />
        ))}
      </div>
    </div>
  );
}
