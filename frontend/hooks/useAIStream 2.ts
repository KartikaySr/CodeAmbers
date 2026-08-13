"use client";

import { useCallback } from "react";
import { generatedCode } from "@/data/mock";
import { nowLabel, uid } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { AgentRole } from "@/types";

const agentScripts: Array<{ agent: AgentRole; body: string }> = [
  { agent: "architect", body: "Plan accepted. I am creating an event-driven orchestration spine with replayable state, agent confidence scoring, and explicit review gates before any ship phase." },
  { agent: "backend", body: "I am drafting the in-memory transport and subscriber model. The shape can later map cleanly to WebSockets, durable queues, or server-sent events without changing the UI contract." },
  { agent: "security", body: "Security pass: every generated event should include provenance, confidence, and phase metadata. Secrets never enter the timeline, and policy checks should run before deploy handoff." }
];

function streamText(text: string, onChunk: (value: string, done: boolean) => void, speed = 15) {
  let index = 0;
  const timer = window.setInterval(() => {
    index += Math.max(1, Math.round(Math.random() * 4));
    const next = text.slice(0, index);
    onChunk(next, index >= text.length);
    if (index >= text.length) window.clearInterval(timer);
  }, speed);
}

export function useAIStream() {
  const appendMessage = useWorkspaceStore((state) => state.appendMessage);
  const updateMessage = useWorkspaceStore((state) => state.updateMessage);
  const setStreaming = useWorkspaceStore((state) => state.setStreaming);
  const activeFileId = useWorkspaceStore((state) => state.activeFileId);
  const updateFileContent = useWorkspaceStore((state) => state.updateFileContent);

  const runPrompt = useCallback((prompt: string) => {
    if (!prompt.trim()) return;
    setStreaming(true);
    appendMessage({ id: uid("user"), author: "You", body: prompt.trim(), timestamp: nowLabel(), kind: "user" });

    agentScripts.forEach((script, scriptIndex) => {
      const messageId = uid(script.agent);
      window.setTimeout(() => {
        appendMessage({ id: messageId, agent: script.agent, author: script.agent.toUpperCase(), body: "", timestamp: nowLabel(), streaming: true, kind: "agent" });
        streamText(script.body, (value, done) => {
          updateMessage(messageId, value, !done);
          if (done && scriptIndex === agentScripts.length - 1) window.setTimeout(() => setStreaming(false), 400);
        });
      }, 380 + scriptIndex * 760);
    });

    window.setTimeout(() => {
      let index = 0;
      const timer = window.setInterval(() => {
        index += 12;
        updateFileContent(activeFileId, generatedCode.slice(0, index));
        if (index >= generatedCode.length) window.clearInterval(timer);
      }, 28);
    }, 1200);
  }, [activeFileId, appendMessage, setStreaming, updateFileContent, updateMessage]);

  return { runPrompt };
}
