"use client";

import { motion } from "framer-motion";
import { ArrowRight, TerminalSquare, Code2, Cpu, Sparkles, ChevronRight } from "lucide-react";
import { agents, featureCards } from "@/data/mock";
import { AgentCard } from "@/components/agents/AgentCard";
import { Brand } from "@/components/ui/Brand";
import { HeroTerminal } from "@/components/landing/HeroTerminal";
import { LivePreview } from "@/components/landing/LivePreview";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-200 selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden">
      {/* Sleek Enterprise Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#agents" className="hover:text-white transition-colors">Agents</a>
            <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/workspace" className="hidden md:flex h-8 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
              Deploy Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* High-Contrast Minimalist Hero */}
      <section className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Subtle Background Glow instead of noise */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
          <Sparkles className="size-4 text-amber-500" />
          <span>CodeAmbers 2.0 is now available</span>
          <ChevronRight className="size-4 text-zinc-500" />
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="z-10 max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
          The collaborative AI <br className="hidden md:block"/> engineering platform.
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="z-10 mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl">
          Build, review, and ship software with a swarm of intelligent agents. CodeAmbers provides the runtime, you provide the vision.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="z-10 mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/workspace" className="flex h-12 items-center justify-center gap-2 rounded-md bg-white px-8 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
            Start Building <ArrowRight className="size-4" />
          </Link>
          <a href="#preview" className="flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-8 text-sm font-medium text-white hover:bg-white/5 transition-colors">
            View Documentation
          </a>
        </motion.div>
        
        <div className="z-10 mt-24 w-full max-w-5xl rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden">
          <HeroTerminal />
        </div>
      </section>

      {/* Clean Feature Grid */}
      <section id="features" className="border-t border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Everything you need to ship.</h2>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">CodeAmbers combines real-time collaboration with intelligent automation to accelerate your development lifecycle.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 hover:border-white/10 transition-colors">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white/5">
                  <feature.icon className="size-5 text-zinc-300 group-hover:text-amber-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Preview Section */}
      <section id="preview" className="border-t border-white/5 bg-black py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Experience the Workspace.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">A seamless environment blending Monaco editor, interactive terminals, and multi-agent chat.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
            <LivePreview />
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="border-t border-white/5 bg-[#050505] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Meet your new team.</h2>
              <p className="mt-4 max-w-2xl text-lg text-zinc-400">Specialized AI agents designed to handle specific domains of your software architecture.</p>
            </div>
            <Link href="/workspace" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Configure Agents <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-xl border border-white/5 bg-[#0a0a0a] p-5 hover:border-white/10 transition-colors">
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
          <Brand />
          <p className="text-sm text-zinc-500">© 2026 CodeAmbers. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
