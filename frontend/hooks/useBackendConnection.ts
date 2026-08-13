"use client";

import { useEffect } from "react";
import { codeAmbersSocket, type ServerEvent } from "@/lib/socket";
import { useWorkspaceStore } from "@/store/workspace-store";

function handleServerEvent(event: ServerEvent) {
  const store = useWorkspaceStore.getState();

  switch (event.type) {
    case "CONNECTED":
      store.setError(null);
      break;
    case "STREAM_START":
      store.setStreaming(true);
      break;
    case "CHAT_CHUNK":
      store.appendChatChunk(event.content);
      break;
    case "CODE_START":
      store.resetStreamingFile(event.file, event.language);
      break;
    case "CODE_CHUNK":
      store.appendFileChunk(event.file, event.content, event.language);
      break;
    case "STREAM_END":
      store.finishStream();
      if (event.status === "failed") store.setError("AI stream ended before completion.");
      break;
    case "ERROR":
      store.finishStream();
      store.setError(event.message);
      break;
    default:
      break;
  }
}

export function useBackendConnection() {
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const loadWorkspace = useWorkspaceStore((state) => state.loadWorkspace);
  const hydrateSession = useWorkspaceStore((state) => state.hydrateSession);
  const setSocketStatus = useWorkspaceStore((state) => state.setSocketStatus);
  const setError = useWorkspaceStore((state) => state.setError);

  useEffect(() => {
    hydrateSession();
    loadWorkspace();
  }, [hydrateSession, loadWorkspace]);

  useEffect(() => {
    const unsubscribeStatus = codeAmbersSocket.onStatus((status) => {
      setSocketStatus(status);
      if (status === "connected") setError(null);
      if (status === "reconnecting") setError("Realtime engine disconnected. Reconnecting...");
    });
    const unsubscribeEvents = codeAmbersSocket.subscribe(handleServerEvent);
    codeAmbersSocket.connect(workspaceId);

    return () => {
      unsubscribeStatus();
      unsubscribeEvents();
    };
  }, [setError, setSocketStatus, workspaceId]);
}
