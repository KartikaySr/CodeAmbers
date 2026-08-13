"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Sparkles, Image as ImageIcon, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIStream } from "@/hooks/useAIStream";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

export function PromptDock() {
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{name: string, type: 'image'|'doc'}[]>([]);
  
  const { runPrompt } = useAIStream();
  const streaming = useWorkspaceStore((state) => state.streaming);
  const socketStatus = useWorkspaceStore((state) => state.socketStatus);
  const disabled = streaming || !["connected", "idle"].includes(socketStatus);

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // In Phase 2, this will trigger the Web Audio API and stream to Groq Whisper
  };

  const handleFileUpload = (type: 'image' | 'doc') => {
    // Mocking file upload for Phase 1
    setAttachedFiles(prev => [...prev, { name: type === 'image' ? 'wireframe.png' : 'requirements.pdf', type }]);
    setShowAttachments(false);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-5 left-5 right-5 z-20">
      
      {/* Attachments Display */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, i) => (
              <div key={i} className="glass flex items-center gap-2 rounded-lg py-1.5 pl-3 pr-2 text-xs text-zinc-300">
                {file.type === 'image' ? <ImageIcon className="size-3 text-amber-core" /> : <FileText className="size-3 text-emerald-400" />}
                {file.name}
                <button onClick={() => removeAttachment(i)} className="ml-1 rounded-full p-0.5 hover:bg-white/10 hover:text-white"><X className="size-3" /></button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Attachment Dropdown */}
        <AnimatePresence>
          {showAttachments && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-1 shadow-2xl backdrop-blur-xl"
            >
              <button onClick={() => handleFileUpload('image')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><ImageIcon className="size-3.5 text-amber-core" /></div>
                Upload Image
              </button>
              <button onClick={() => handleFileUpload('doc')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><FileText className="size-3.5 text-emerald-400" /></div>
                Upload Document
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("glass amber-ring flex items-center gap-2 rounded-full p-2 transition-all", isRecording && "ring-2 ring-red-500/50 bg-red-500/5")}>
          <button onClick={() => setShowAttachments(!showAttachments)} aria-label="Attach file" className="grid size-10 shrink-0 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-white">
            <Paperclip className="size-4" />
          </button>
          
          <Sparkles className={cn("size-4 shrink-0 transition-colors", isRecording ? "text-red-400" : "text-amber-core")} />
          
          <input 
            value={prompt} 
            onChange={(event) => setPrompt(event.target.value)} 
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !disabled) runPrompt(prompt); }} 
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" 
            placeholder={isRecording ? "Listening... (Speak now)" : "Ask CodeAmbers to build, refactor, review, or deploy..."} 
          />
          
          {isRecording && (
            <div className="flex items-center gap-1 pr-3">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="w-1 bg-red-500 rounded-full" animate={{ height: ["4px", "16px", "4px"] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          )}

          <span className="hidden rounded-full border border-white/8 px-2 py-1 font-mono text-[10px] text-zinc-500 sm:block">CMD K</span>
          
          <button onClick={handleMicClick} aria-label="Voice prompt" className={cn("grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white/[0.08]", isRecording ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "text-zinc-400 hover:text-white")}>
            <Mic className="size-4" />
          </button>
          
          <button aria-label="Send prompt" disabled={disabled || (!prompt && attachedFiles.length === 0)} onClick={() => runPrompt(prompt)} className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-core text-black shadow-amber transition hover:scale-105 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
