import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Save } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [groqKey, setGroqKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");

  useEffect(() => {
    if (isOpen) {
      setGroqKey(localStorage.getItem("GROQ_API_KEY") || "");
      setSupabaseUrl(localStorage.getItem("SUPABASE_URL") || "");
      setSupabaseKey(localStorage.getItem("SUPABASE_ANON_KEY") || "");
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("GROQ_API_KEY", groqKey);
    localStorage.setItem("SUPABASE_URL", supabaseUrl);
    localStorage.setItem("SUPABASE_ANON_KEY", supabaseKey);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass floating-panel w-full max-w-lg p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Key className="size-5 text-amber-core" />
                Global Settings
              </h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Groq API Key</label>
                <input 
                  type="password" 
                  value={groqKey} 
                  onChange={(e) => setGroqKey(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-amber-core/50"
                  placeholder="gsk_..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Supabase URL</label>
                <input 
                  type="text" 
                  value={supabaseUrl} 
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-amber-core/50"
                  placeholder="https://xyz.supabase.co"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Supabase Anon Key</label>
                <input 
                  type="password" 
                  value={supabaseKey} 
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-amber-core/50"
                  placeholder="eyJh..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition">Cancel</button>
              <button onClick={handleSave} className="floating-btn flex items-center gap-2 rounded-lg bg-amber-core/20 border border-amber-core/50 px-4 py-2 text-sm text-amber-50 shadow-[0_0_10px_rgba(255,170,0,0.3)]">
                <Save className="size-4" /> Save Configuration
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
