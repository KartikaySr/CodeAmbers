"use client";

import { motion } from "framer-motion";
import { Panel } from "@/components/ui/Panel";

export function LivePreview() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">Live Preview</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Agents stream the build while you steer.</h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">CodeAmbers turns plans, code, review, and deployment readiness into one continuous engineering surface.</p>
        <div className="mt-8 grid gap-3">
          {["Architecture generated", "Editor synchronized", "Security review active"].map((item, index) => (
            <motion.div key={item} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.035] px-4 py-3 text-sm text-zinc-300">
              {item}<span className="font-mono text-xs text-emerald-300">online</span>
            </motion.div>
          ))}
        </div>
      </Panel>
      <Panel className="min-h-[420px] p-4">
        <div className="grid h-full gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/5 bg-black/40 p-4 font-mono text-xs leading-6 text-zinc-300">
            <p className="text-amber-core">[ARCHITECT] generating service map</p>
            <p className="text-cyan-300">[BACKEND] writing orchestration stream</p>
            <p className="text-emerald-300">[SECURITY] validating policy gates</p>
            <p className="mt-4 text-zinc-500">events: 128 | confidence: 94% | drift: low</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-[#050505] p-4 font-mono text-xs leading-6">
            <p className="text-zinc-500">src/ai/orchestrator.ts</p>
            <pre className="mt-3 whitespace-pre-wrap text-zinc-300">{`export function routeAgent(event) {
  if (event.phase === "review") {
    return security.verify(event);
  }
  return swarm.dispatch(event);
}`}</pre>
            <span className="caret text-amber-core" />
          </div>
        </div>
      </Panel>
    </section>
  );
}
