"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Lock, Sparkles, TerminalSquare } from "lucide-react";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";
import { Brand } from "@/components/ui/Brand";
import { Panel } from "@/components/ui/Panel";

export default function AboutPage() {
  return (
    <main className="noise relative min-h-screen overflow-hidden bg-black px-6 py-12 md:px-12 lg:px-24">
      <AmbientBackground />
      <Particles />
      <div className="relative z-10 mx-auto max-w-5xl">
        <nav className="mb-12 flex items-center justify-between">
          <Brand />
          <Link href="/" className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">The Mission</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Autonomous Software <br className="hidden md:block" /> Engineering at Scale.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            CodeAmbers is not just a code editor. It is a fully-integrated AI operating system designed to collaborate with human engineers, execute code securely, and build the future of software autonomously.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Cpu,
              title: "AI Orchestration",
              desc: "Multi-agent systems handle backend, frontend, and DevOps concurrently within the same session.",
            },
            {
              icon: TerminalSquare,
              title: "Secure Sandbox",
              desc: "Every workspace spins up an isolated V8 isolate sandbox for secure code execution and testing.",
            },
            {
              icon: Lock,
              title: "Enterprise Grade",
              desc: "JWT-backed authentication, E2E encryption for env variables, and strict RBAC controls.",
            },
          ].map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Panel className="flex h-full flex-col p-6 hover:bg-white/[0.04] transition-colors">
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-core border border-amber-500/20">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feature.desc}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
