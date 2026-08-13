"use client";

import { useMemo } from "react";
import { agents } from "@/data/mock";
import { useWorkspaceStore } from "@/store/workspace-store";

export function useAgents() {
  const activeAgents = useWorkspaceStore((state) => state.activeAgents);
  return useMemo(
    () => agents.map((agent) => ({ ...agent, selected: activeAgents.includes(agent.id) })),
    [activeAgents]
  );
}
