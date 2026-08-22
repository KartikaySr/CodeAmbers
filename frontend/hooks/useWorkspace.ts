"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";

export function useWorkspace() {
  const state = useWorkspaceStore();
  const activeFile = useMemo(
    () => state.files.find((file) => file.id === state.activeFileId) ?? state.files[0] ?? {
      id: "empty",
      name: "No file selected",
      path: "",
      language: "typescript",
      content: "",
      dirty: false,
    },
    [state.activeFileId, state.files]
  );

  return { ...state, activeFile };
}
