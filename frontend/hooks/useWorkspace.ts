"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";

export function useWorkspace() {
  const state = useWorkspaceStore();
  const activeFile = useMemo(
    () => state.files.find((file) => file.id === state.activeFileId) ?? state.files[0],
    [state.activeFileId, state.files]
  );

  return { ...state, activeFile };
}
