"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, FolderGit2, Plus, Terminal, X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setShowNewWorkspaceModal(false);
      router.push("/workspace");
    }, 1200);
  };

  return (
    <div className="p-8 md:p-12">
      {/* New Workspace Modal */}
      <AnimatePresence>
        {showNewWorkspaceModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowNewWorkspaceModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
            >
              <Panel className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-amber-core/10 text-amber-core">
                      <Rocket className="size-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">New Workspace</h2>
                  </div>
                  <button onClick={() => setShowNewWorkspaceModal(false)} className="text-zinc-500 hover:text-white transition"><X className="size-5" /></button>
                </div>
                <form onSubmit={handleCreateWorkspace} className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Workspace Name
                    <input 
                      value={newWorkspaceName} 
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20" 
                      placeholder="e.g. Next.js Landing Page" 
                      required 
                      autoFocus
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Initial Tech Stack (Optional)
                    <select className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20">
                      <option value="nextjs">Next.js + Tailwind (React)</option>
                      <option value="node">Node.js Express API</option>
                      <option value="vanilla">Vanilla HTML/JS/CSS</option>
                    </select>
                  </label>
                  <Button type="submit" disabled={isCreating} className="mt-4 w-full justify-center">
                    {isCreating ? "Initializing Sandbox..." : "Launch Workspace"}
                  </Button>
                </form>
              </Panel>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Workspaces</h1>
            <p className="mt-2 text-zinc-400">Manage your active engineering environments.</p>
          </div>
          <Button onClick={() => setShowNewWorkspaceModal(true)} className="flex items-center gap-2">
            <Plus className="size-4" /> New Workspace
          </Button>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "CodeAmbers Platform", time: "2 mins ago", active: true },
            { name: "Finance Dashboard", time: "5 hours ago", active: false },
            { name: "Auth Microservice", time: "2 days ago", active: false },
          ].map((ws, i) => (
            <motion.div key={ws.name} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Link href="/workspace">
                <Panel className="group flex h-40 flex-col justify-between p-5 hover:border-amber-core/30 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-lg bg-white/[0.05] border border-white/10 group-hover:bg-amber-core/10 group-hover:border-amber-core/20 group-hover:text-amber-core transition-colors">
                        <FolderGit2 className="size-5 text-zinc-400 group-hover:text-amber-core" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{ws.name}</h3>
                        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><Clock className="size-3" /> {ws.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${ws.active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{ws.active ? 'Active' : 'Hibernated'}</span>
                    </div>
                    <Terminal className="size-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </Panel>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
