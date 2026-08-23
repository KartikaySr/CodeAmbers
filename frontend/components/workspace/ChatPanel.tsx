"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageBubble } from "@/components/workspace/MessageBubble";
import { PromptDock } from "@/components/workspace/PromptDock";
import { TypingIndicator } from "@/components/workspace/TypingIndicator";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const { messages, streaming, socketStatus, backendStatus, error } = useWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden surface-sidebar border-l border-subtle">
      <div className="shrink-0 border-b border-subtle px-4 py-3 bg-surface-sidebar flex items-center justify-between">
        <h2 className="text-[12px] font-semibold text-primary uppercase tracking-wider">Command Stream</h2>
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
          socketStatus === "connected" ? "text-emerald-500" : "text-amber-500"
        )}>
          <div className={cn("size-1.5 rounded-full", socketStatus === "connected" ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
          {backendStatus === "offline" ? "Offline" : socketStatus}
        </div>
      </div>
      
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-error/20 bg-error/10 px-3 py-2 text-xs text-error">
            {error}
          </motion.div>
        )}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {streaming && <TypingIndicator />}
      </div>
    </aside>
  );
}
