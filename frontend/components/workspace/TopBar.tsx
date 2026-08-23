"use client";

import { Brand } from "@/components/ui/Brand";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Settings, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./modals/SettingsModal";

export function TopBar() {
  const { workspaceName, user, socketStatus, logout } = useWorkspace();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="h-12 w-full surface-sidebar divider-b flex items-center justify-between px-4 shrink-0">
        
        {/* LEFT: Branding & Workspace */}
        <div className="flex items-center gap-4">
          <Brand className="scale-75 origin-left" />
          <div className="w-px h-4 bg-white/[0.07]" />
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-primary">Workspace</span>
            <span className="text-secondary text-[13px]">/</span>
            <span className="text-[13px] text-secondary">{workspaceName}</span>
          </div>
        </div>

        {/* RIGHT: Status & Controls */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {socketStatus === "connected" ? (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                <CheckCircle2 className="size-3.5" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500">
                <AlertCircle className="size-3.5" />
                <span>Offline</span>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-white/[0.07]" />

          {/* Avatar & Dropdown */}
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSettings(true)} className="text-secondary hover:text-primary transition-colors">
              <Settings className="size-4" />
            </button>
            <button onClick={() => logout()} className="text-secondary hover:text-error transition-colors">
              <LogOut className="size-4" />
            </button>
            <div className="grid size-6 place-items-center rounded-full bg-surface-elevated border border-subtle text-[10px] font-bold text-primary cursor-pointer hover:border-white/20 transition-colors">
              {(user?.name || "O").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
