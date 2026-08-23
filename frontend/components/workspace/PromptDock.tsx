"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Sparkles, Image as ImageIcon, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIStream } from "@/hooks/useAIStream";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

export type AgentRole = "architect" | "frontend" | "backend" | "security" | "devops";

export function PromptDock() {
  const [prompt, setPrompt] = useState("");
  const [agentMode, setAgentMode] = useState<AgentRole>("architect");
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{name: string, type: 'image'|'doc', content?: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { runPrompt } = useAIStream();
  const streaming = useWorkspaceStore((state) => state.streaming);
  const socketStatus = useWorkspaceStore((state) => state.socketStatus);
  const disabled = streaming || !["connected", "idle"].includes(socketStatus);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          // Just overwrite prompt with the running transcript for a smoother experience
          setPrompt(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setPrompt("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type === 'application/pdf') {
      setUploading(true);
      setShowAttachments(false);
      try {
        const formData = new FormData();
        formData.append('file', file);
        // We assume backend is running on the same domain or we use the generic environment path
        // For local dev it might be localhost:8080, but let's use a relative path if proxied, or rely on a NEXT_PUBLIC_API_URL
        const apiUrl = process.env.NEXT_PUBLIC_WS_URL?.replace('ws://', 'http://').replace('wss://', 'https://').replace('/ws', '') || 'http://localhost:8080';
        
        const response = await fetch(`${apiUrl}/api/upload/pdf`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        
        setAttachedFiles(prev => [...prev, { name: file.name, type: 'doc', content: data.text }]);
      } catch (err) {
        console.error(err);
        alert('Failed to parse PDF document.');
      } finally {
        setUploading(false);
      }
    } else {
      // Mock image for now
      setAttachedFiles(prev => [...prev, { name: file.name, type: 'image' }]);
      setShowAttachments(false);
    }
  };

  const submitPrompt = () => {
    if (disabled || (!prompt && attachedFiles.length === 0)) return;
    
    // Combine prompt and attachments
    let finalPrompt = prompt;
    attachedFiles.forEach(f => {
      if (f.content) {
        finalPrompt += `\n\n--- Document: ${f.name} ---\n${f.content}\n--- End Document ---\n`;
      }
    });
    
    runPrompt(finalPrompt, agentMode);
    setPrompt("");
    setAttachedFiles([]);
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
              className="absolute bottom-full left-0 mb-3 w-48 overflow-hidden rounded-xl border border-white/[0.04] bg-[#09090b]/95 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl"
            >
              <button onClick={() => { 
                setAttachedFiles(prev => [...prev, { name: 'wireframe.png', type: 'image' }]);
                setShowAttachments(false);
              }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><ImageIcon className="size-3.5 text-amber-500" /></div>
                Upload Image
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} disabled={uploading} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><FileText className="size-3.5 text-emerald-400" /></div>
                {uploading ? "Uploading..." : "Upload Document (PDF)"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />

        <div className={cn("relative flex items-center gap-2 rounded-[20px] p-2 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl border", isRecording ? "border-red-500/30 bg-red-500/5 ring-4 ring-red-500/10" : "border-white/[0.06] bg-[#09090b]/60 focus-within:bg-[#09090b]/80 focus-within:border-amber-500/30 focus-within:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(255,170,0,0.1)]")}>
          
          <div className="relative">
            <button 
              onClick={() => { setShowAgentMenu(!showAgentMenu); setShowAttachments(false); }}
              className="flex items-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2 text-[13px] font-semibold text-zinc-300 transition-colors border border-transparent hover:border-white/[0.04]"
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span className="capitalize">{agentMode}</span>
            </button>
            
            <AnimatePresence>
              {showAgentMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-full left-0 mb-3 w-44 overflow-hidden rounded-xl border border-white/[0.04] bg-[#09090b]/95 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl"
                >
                  {(["architect", "frontend", "backend", "security", "devops"] as AgentRole[]).map(role => (
                    <button 
                      key={role}
                      onClick={() => { setAgentMode(role); setShowAgentMenu(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                        agentMode === role ? "bg-amber-500/10 text-amber-500" : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
                      )}
                    >
                      <span className="capitalize">{role}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => { setShowAttachments(!showAttachments); setShowAgentMenu(false); }} aria-label="Attach file" className="grid size-10 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200">
            <Paperclip className="size-4" />
          </button>
          
          <input 
            value={prompt} 
            onChange={(event) => setPrompt(event.target.value)} 
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !disabled) submitPrompt(); }} 
            className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-zinc-100 outline-none placeholder:text-zinc-600 font-medium" 
            placeholder={isRecording ? "Listening... (Speak now)" : "Ask CodeAmbers to build, refactor, review, or deploy..."} 
          />
          
          {isRecording && (
            <div className="flex items-center gap-1 pr-3">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="w-1 bg-red-500 rounded-full" animate={{ height: ["4px", "16px", "4px"] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          )}

          <span className="hidden rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-zinc-500 sm:block">CMD K</span>
          
          <button onClick={handleMicClick} aria-label="Voice prompt" className={cn("grid size-10 shrink-0 place-items-center rounded-full transition-colors", isRecording ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200")}>
            <Mic className="size-4" />
          </button>
          
          <button aria-label="Send prompt" disabled={disabled || (!prompt && attachedFiles.length === 0)} onClick={submitPrompt} className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-gradient-to-b from-amber-400 to-amber-600 text-black shadow-[0_2px_10px_rgba(255,170,0,0.3)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
