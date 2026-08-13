"use client";

import { motion } from "framer-motion";

export function AmbientBackground({ intensity = "normal" }: { intensity?: "normal" | "strong" }) {
  const opacity = intensity === "strong" ? 0.42 : 0.24;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute -left-32 top-8 h-96 w-96 rounded-full bg-amber-core/20 blur-3xl" animate={{ x: [0, 70, 20, 0], y: [0, 40, -10, 0], opacity: [opacity, opacity * 0.75, opacity] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" animate={{ x: [0, -60, 0], y: [0, 60, 0], opacity: [0.18, 0.28, 0.18] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.2, 0.12] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <div className="grid-mask absolute inset-0 opacity-60" />
    </div>
  );
}
