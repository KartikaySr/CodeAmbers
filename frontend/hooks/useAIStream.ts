"use client";

import { useCallback } from "react";
import { codeAmbersSocket } from "@/lib/socket";
import { nowLabel, uid } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { AgentRole } from "@/components/workspace/PromptDock";

export function useAIStream() {
  const appendMessage = useWorkspaceStore((state) => state.appendMessage);
  const setStreaming = useWorkspaceStore((state) => state.setStreaming);
  const setError = useWorkspaceStore((state) => state.setError);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const activeFile = useWorkspaceStore((state) => state.files.find((file) => file.id === state.activeFileId));

  const runPrompt = useCallback((prompt: string, mode: AgentRole = "architect") => {
    if (!prompt.trim()) return;
    setError(null);
    setStreaming(true);
    appendMessage({
      id: uid("user"),
      author: "You",
      body: prompt.trim(),
      timestamp: nowLabel(),
      kind: "user"
    });
    
    // Retrieve the user's API Key from Settings
    const apiKey = localStorage.getItem("GROQ_API_KEY") || undefined;

    const sent = codeAmbersSocket.send({
      type: "AI_PROMPT",
      prompt: prompt.trim(),
      workspaceId,
      activeFile: activeFile?.path,
      mode: mode as any,
      apiKey
    });

    if (!sent) {
      setError("Reconnecting to the CodeAmbers engine. Your prompt will be ready once the socket is online.");
    }
  }, [activeFile?.path, appendMessage, setError, setStreaming, workspaceId]);

  return { runPrompt };
}
