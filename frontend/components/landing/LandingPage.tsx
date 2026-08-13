"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { agents, featureCards } from "@/data/mock";
import { AgentCard } from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/ui/Brand";
import { PageShell } from "@/components/effects/PageShell";
import { HeroTerminal } from "@/components/landing/HeroTerminal";
import { LivePreview } from "@/components/landing/LivePreview";
import { Panel } from "@/components/ui/Panel";

export function LandingPage() {
  return (
    <PageShell>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Brand />
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#preview" className="hover:text-white">Preview</a>
          <a href="#agents" className="hover:text-white">Agents</a>
          <a href="#future" className="hover:text-white">Vision</a>
        </nav>
        <Button href="/sign-in" variant="secondary">Sign in</Button>
      </header>
      <section className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-12 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-core/20 bg-amber-core/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
          <Sparkles className="size-3.5" /> AI engineering operating system
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-balance max-w-6xl text-6xl font-semibold tracking-[-0.04em] text-white md:text-8xl lg:text-9xl">
          Fuel for Autonomous Engineering.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
          CodeAmbers transforms software creation into a real-time AI-native collaborative experience.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="/workspace" icon={<ArrowRight className="size-4" />}>Enter Workspace</Button>
          <Button href="#preview" variant="secondary" icon={<Play className="size-4" />}>Watch Demo</Button>
        </motion.div>
        <div className="w-full"><HeroTerminal /></div>
      </section>
      <div id="preview"><LivePreview /></div>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">Capabilities</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">A complete AI build loop.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-400">The interface is built around continuous orchestration, not static dashboards.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
              <Panel className="h-full p-5">
                <feature.icon className="size-5 text-amber-core" />
                <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.copy}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="agents" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">AI Agents</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Specialists that move as one.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}</div>
      </section>
      <section id="future" className="mx-auto max-w-7xl px-6 py-24">
        <Panel className="relative min-h-[460px] p-8 md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.18),transparent_36%),radial-gradient(circle_at_20%_70%,rgba(34,211,238,0.10),transparent_34%)]" />
          <div className="relative grid h-full gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">Future of Engineering</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">Control a living engineering system.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">Describe intent, watch agents negotiate the build, inspect the code, and keep every decision observable.</p>
            </div>
            <div className="grid gap-3 font-mono text-xs">
              {["intent parsed", "plan converged", "patch streaming", "review gate passed", "preview ready"].map((step, index) => (
                <motion.div key={step} animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }} className="rounded-lg border border-white/5 bg-black/35 px-4 py-3 text-zinc-300">
                  0{index + 1}. {step}
                </motion.div>
              ))}
            </div>
          </div>
        </Panel>
      </section>
      <footer className="mx-auto max-w-7xl px-6 pb-12">
        <Panel className="p-8 text-center md:p-12">
          <h2 className="text-4xl font-semibold text-white md:text-6xl">Enter the autonomous workspace.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">CodeAmbers is a fully integrated end-to-end platform powered by Groq AI and WebSockets for real-time collaboration.</p>
          <div className="mt-8"><Button href="/workspace" icon={<ArrowRight className="size-4" />}>Launch CodeAmbers</Button></div>
        </Panel>
      </footer>
    </PageShell>
  );
}
