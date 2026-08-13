"use client";

import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/effects/AmbientBackground";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <AmbientBackground />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative size-16">
          <motion.div
            className="absolute inset-0 rounded-xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-white">
            C
          </div>
        </div>
        <motion.p
          className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Initializing Secure Sandbox...
        </motion.p>
      </div>
    </div>
  );
}
