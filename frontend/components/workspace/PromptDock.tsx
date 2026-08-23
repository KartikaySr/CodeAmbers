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
    
    runPrompt(finalPrompt);
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
              className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-1 shadow-2xl backdrop-blur-xl"
            >
              <button onClick={() => { 
                setAttachedFiles(prev => [...prev, { name: 'wireframe.png', type: 'image' }]);
                setShowAttachments(false);
              }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><ImageIcon className="size-3.5 text-amber-core" /></div>
                Upload Image
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} disabled={uploading} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <div className="grid size-7 place-items-center rounded-md bg-white/5"><FileText className="size-3.5 text-emerald-400" /></div>
                {uploading ? "Uploading..." : "Upload Document (PDF)"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />

        <div className={cn("glass amber-ring flex items-center gap-2 rounded-full p-2 transition-all", isRecording && "ring-2 ring-red-500/50 bg-red-500/5")}>
          <button onClick={() => setShowAttachments(!showAttachments)} aria-label="Attach file" className="grid size-10 shrink-0 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-white">
            <Paperclip className="size-4" />
          </button>
          
          <Sparkles className={cn("size-4 shrink-0 transition-colors", isRecording ? "text-red-400" : "text-amber-core")} />
          
          <input 
            value={prompt} 
            onChange={(event) => setPrompt(event.target.value)} 
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !disabled) submitPrompt(); }} 
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
          
          <button aria-label="Send prompt" disabled={disabled || (!prompt && attachedFiles.length === 0)} onClick={submitPrompt} className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-core text-black shadow-amber transition hover:scale-105 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
