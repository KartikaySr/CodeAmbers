import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Save } from "lucide-react";
import { agents } from "@/data/mock";

interface AgentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentConfigModal({ isOpen, onClose }: AgentConfigModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0].id);
  
  const selectedAgent = agents.find(a => a.id === selectedAgentId)!;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass floating-panel w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="size-5 text-amber-core" />
                Agent Configurator
              </h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 flex gap-6 flex-1 min-h-0">
              <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2">
                {agents.map(agent => (
                  <button 
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${selectedAgentId === agent.id ? 'border-amber-core/50 bg-amber-core/10' : 'border-white/5 hover:bg-white/[0.05]'}`}
                  >
                    <div className={`size-2 rounded-full ${selectedAgentId === agent.id ? 'bg-amber-core' : 'bg-zinc-600'}`} />
                    <div>
                      <div className="text-sm font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-zinc-500">{agent.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="w-2/3 flex flex-col gap-4 overflow-y-auto pl-2 border-l border-white/10">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">System Prompt</label>
                  <textarea 
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-amber-core/50 resize-none font-mono"
                    defaultValue={`You are a ${selectedAgent.role} agent. Your job is to...`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Model</label>
                    <select className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-amber-core/50">
                      <option>llama-3.3-70b-versatile</option>
                      <option>mixtral-8x7b-32768</option>
                      <option>gemma2-9b-it</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Temperature (0-1)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      defaultValue={0.2}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-amber-core/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 shrink-0 border-t border-white/10 pt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition">Cancel</button>
              <button onClick={onClose} className="floating-btn flex items-center gap-2 rounded-lg bg-amber-core/20 border border-amber-core/50 px-4 py-2 text-sm text-amber-50 shadow-[0_0_10px_rgba(255,170,0,0.3)]">
                <Save className="size-4" /> Save Agents
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
