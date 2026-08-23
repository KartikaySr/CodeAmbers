"use client";

import { FolderGit2, Bot, Rocket, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

const sidebarItems = [
  { id: "files", icon: FolderGit2, tooltip: "Explorer" },
  { id: "search", icon: Search, tooltip: "Search" },
  { id: "agents", icon: Bot, tooltip: "Agents" },
  { id: "deploy", icon: Rocket, tooltip: "Deployments" },
];

export function Sidebar() {
  const [activeNav, setActiveNav] = useState("files");

  return (
    <aside className="w-14 h-full surface-sidebar divider-r flex flex-col items-center py-4 shrink-0">
      <div className="flex flex-col gap-4">
        {sidebarItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveNav(item.id)} 
              className={cn(
                "relative flex size-10 items-center justify-center rounded-lg transition-colors group", 
                isActive ? "text-primary" : "text-muted hover:text-secondary"
              )}
              title={item.tooltip}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-lg bg-white/[0.04] border border-subtle" />
              )}
              <item.icon className="size-[18px] relative z-10" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
