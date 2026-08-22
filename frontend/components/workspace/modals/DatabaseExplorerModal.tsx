import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, Table, Shield } from "lucide-react";

interface DatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DatabaseExplorerModal({ isOpen, onClose }: DatabaseExplorerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass floating-panel w-full max-w-4xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="size-5 text-emerald-400" />
                Supabase DB Explorer
              </h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 flex gap-6 flex-1 min-h-0">
              <div className="w-1/4 flex flex-col gap-2 overflow-y-auto pr-2">
                <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono">Public Schema</div>
                <button className="flex items-center gap-2 p-2 rounded bg-emerald-400/10 border border-emerald-400/20 text-emerald-100 text-sm">
                  <Table className="size-4" /> workspaces
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-zinc-400 text-sm transition">
                  <Table className="size-4" /> files
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-zinc-400 text-sm transition">
                  <Table className="size-4" /> conversations
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-zinc-400 text-sm transition">
                  <Table className="size-4" /> messages
                </button>
              </div>
              
              <div className="w-3/4 flex flex-col gap-4 overflow-y-auto pl-4 border-l border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-mono flex items-center gap-2"><Table className="size-4 text-zinc-400"/> workspaces</h3>
                  <span className="text-xs text-zinc-500 font-mono">2 rows</span>
                </div>
                
                <div className="border border-white/10 rounded-lg overflow-hidden bg-black/30">
                  <table className="w-full text-left text-sm text-zinc-300 font-mono">
                    <thead className="bg-white/5 text-zinc-500 text-xs uppercase">
                      <tr>
                        <th className="p-3 font-medium">id (uuid)</th>
                        <th className="p-3 font-medium">name (text)</th>
                        <th className="p-3 font-medium">created_at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5 transition">
                        <td className="p-3 text-emerald-400/80">workspace-1...</td>
                        <td className="p-3 text-amber-200">codeambers/v1</td>
                        <td className="p-3 text-zinc-500">2026-08-23 00:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1"><Shield className="size-3.5"/> Row Level Security Policies</h4>
                  <div className="bg-black/40 border border-white/10 rounded p-3 text-sm text-zinc-400 font-mono">
                    <div className="text-emerald-400">Policy: "Users can view own workspace"</div>
                    <div className="pl-4 mt-1">USING (auth.uid() = user_id)</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
