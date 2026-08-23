"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Box, Sparkles, X } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useWorkspace } from "@/hooks/useWorkspace";

export function IntegrationsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { files } = useWorkspace();

  const handleDownloadZip = () => {
    const zip = new JSZip();
    
    // Add files to zip
    files.forEach(file => {
      // Basic heuristic for putting files into folders if needed, but for now we put them in root
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, "CodeAmbers_Export.zip");
    });
  };

  const handleReplitExport = () => {
    alert("In a full production environment, this would authorize your GitHub account, push the current repo, and redirect to Replit. For now, please use 'Download ZIP' and drag-and-drop into Replit.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Export & Integrations</h2>
              <button onClick={onClose} className="rounded-full p-1 text-zinc-500 hover:bg-white/5 hover:text-white transition">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <button onClick={handleDownloadZip} className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Download className="size-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">Download ZIP</h3>
                  <p className="text-xs text-zinc-400 mt-1">Export current workspace for local development</p>
                </div>
              </button>

              <button onClick={handleReplitExport} className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Box className="size-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">Open in Replit</h3>
                  <p className="text-xs text-zinc-400 mt-1">1-click port your CodeAmbers project to Replit</p>
                </div>
              </button>
              
              <button onClick={handleDownloadZip} className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Sparkles className="size-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">Antigravity / AI Studio</h3>
                  <p className="text-xs text-zinc-400 mt-1">Export bundle compatible with Google AI Studio</p>
                </div>
              </button>
            </div>
            
            <div className="border-t border-white/5 bg-white/[0.02] px-5 py-4">
              <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                Need more integrations? <a href="#" className="text-amber-core hover:underline inline-flex items-center gap-1">View Docs <ExternalLink className="size-3" /></a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
