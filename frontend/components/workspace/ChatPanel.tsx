"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageBubble } from "@/components/workspace/MessageBubble";
import { PromptDock } from "@/components/workspace/PromptDock";
import { TypingIndicator } from "@/components/workspace/TypingIndicator";
import { useWorkspace } from "@/hooks/useWorkspace";

export function ChatPanel() {
  const { messages, streaming, socketStatus, backendStatus, error } = useWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <section className="relative flex h-full min-h-0 flex-col border-r border-white/5 bg-[#050505]/70">
      <div className="shrink-0 border-b border-white/5 px-5 py-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs uppercase tracking-[0.22em] text-amber-core">Conversational Orchestration</motion.p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h1 className="text-2xl font-semibold text-white">Command Stream</h1>
          <div className={[
            "rounded-full border px-3 py-1 text-xs",
            socketStatus === "connected"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              : "border-amber-core/20 bg-amber-core/10 text-amber-200"
          ].join(" ")}>
            {backendStatus === "offline" ? "backend offline" : `websocket ${socketStatus}`}
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-32 pt-5">
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-amber-core/20 bg-amber-core/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </motion.div>
        )}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {streaming && <TypingIndicator />}
      </div>
      <PromptDock />
    </section>
  );
}
