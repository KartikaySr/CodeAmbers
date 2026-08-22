"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bot, FolderGit2, Home, Settings, LayoutDashboard } from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="noise relative flex min-h-screen bg-black">
      <AmbientBackground />
      <Particles />
      
      {/* Sidebar */}
      <aside className="relative z-20 flex w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Brand />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-amber-core/10 text-amber-core" 
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <item.icon className={`size-4 ${isActive ? "text-amber-core" : "text-zinc-500 group-hover:text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-white/[0.05] text-xs font-bold text-zinc-300">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-white">Operator</p>
              <p className="text-xs text-zinc-500">Developer Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-auto bg-black/20 backdrop-blur-sm">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
