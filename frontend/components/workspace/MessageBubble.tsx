"use client";

import { motion } from "framer-motion";
import { agents } from "@/data/mock";
import type { ChatMessage } from "@/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const agent = agents.find((item) => item.id === message.agent);
  const isUser = message.kind === "user";
  const isSystem = message.kind === "system";
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={isUser ? "ml-auto max-w-[84%]" : "mr-auto max-w-[92%]"}>
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className={isUser ? "text-amber-core" : isSystem ? "text-zinc-500" : "text-white"}>{message.author}</span>
        <span className="text-zinc-600">{message.timestamp}</span>
        {message.streaming && <span className="text-emerald-300">streaming</span>}
      </div>
      <div className={(isUser ? "border-amber-core/20 bg-amber-core/10 text-amber-50" : "border-white/7 bg-white/[0.045] text-zinc-300") + " rounded-lg border px-4 py-3 text-sm leading-6 shadow-2xl backdrop-blur-xl"} style={agent ? { boxShadow: `0 0 34px ${agent.accent}14` } : undefined}>
        {message.body.includes("[MODULE:") ? (
          <div className="grid gap-3">
            <p className="whitespace-pre-wrap text-zinc-400">
              {message.body.split("[MODULE:")[0]}
            </p>
            <div className="overflow-hidden rounded-md border border-white/10 bg-black/40">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-medium text-amber-core">
                <span>Generative AI Module</span>
                <span className="flex items-center gap-1">
                  {message.streaming && <span className="size-1.5 rounded-full bg-amber-core animate-pulse" />}
                  {message.streaming ? "Executing..." : "Completed"}
                </span>
              </div>
              <div className="p-3 font-mono text-xs text-zinc-300">
                {message.body.split("[MODULE:")[1].split("]")[0].trim()}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div 
                    className="h-full bg-emerald-500/50" 
                    initial={{ width: 0 }} 
                    animate={{ width: message.streaming ? "60%" : "100%" }} 
                    transition={{ duration: 2 }} 
                  />
                </div>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-zinc-400">
              {message.body.split("]").slice(1).join("]")}
            </p>
          </div>
        ) : (
          <p className={message.streaming ? "caret whitespace-pre-wrap" : "whitespace-pre-wrap"}>{message.body}</p>
        )}
      </div>
    </motion.div>
  );
}
