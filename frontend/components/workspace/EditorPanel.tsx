"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Code2, FileCode2, Maximize2, Play, Search, SplitSquareHorizontal, Eye, EyeOff, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import { codeAmbersSocket } from "@/lib/socket";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-[#050505] font-mono text-sm text-zinc-500">Warming Monaco editor...</div>
});

export function EditorPanel() {
  const { files, activeFile, activeFileId, setActiveFile, updateFileContent, backendStatus } = useWorkspace();
  const [showPreview, setShowPreview] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const unsub = codeAmbersSocket.subscribe((event) => {
      if (event.type === "CODE_REVIEW_RESULT") {
        setAiReview(event.content);
        setLoadingReview(false);
      }
    });
    return unsub;
  }, []);

  const reviewCode = () => {
    setLoadingReview(true);
    codeAmbersSocket.send({ type: "AI_CODE_REVIEW", fileContent: activeFile.content });
  };

  // Helper to extract file contents for Sandpack
  const getSandpackFiles = () => {
    const spFiles: Record<string, string> = {};
    files.forEach(f => {
      // Assuming paths like "App.tsx", "index.tsx", "styles.css"
      const path = f.path.startsWith('/') ? f.path : `/${f.path}`;
      spFiles[path] = f.content;
    });
    return spFiles;
  };

  return (
    <section className="glass floating-panel flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 bg-black/20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-core drop-shadow-[0_0_10px_rgba(255,170,0,0.5)]">Live Workspace</p>
          <h2 className="mt-1 text-lg font-semibold text-white drop-shadow-md">Monaco Code Surface</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={reviewCode}
            disabled={loadingReview}
            className="floating-btn flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20 shadow-[0_0_10px_rgba(255,170,0,0.2)]"
          >
            <ShieldAlert className="size-3.5" /> {loadingReview ? "Reviewing..." : "Review Code"}
          </button>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={cn("floating-btn flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition", showPreview ? "border-amber-core/50 bg-amber-core/20 text-amber-50 shadow-[0_0_15px_rgba(255,170,0,0.3)]" : "border-white/10 bg-white/5 text-zinc-300 hover:text-white")}
          >
            {showPreview ? <><EyeOff className="size-3.5" /> Close Preview</> : <><Eye className="size-3.5" /> Live Preview</>}
          </button>
          {[Search, SplitSquareHorizontal, Maximize2, Play].map((Icon, index) => (
            <button key={index} className="floating-btn grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white"><Icon className="size-4" /></button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 border-b border-white/5 bg-black/30">
        {files.map((file) => (
          <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("flex min-w-0 items-center gap-2 border-r border-white/5 px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white", activeFileId === file.id && "bg-amber-core/10 text-amber-100 shadow-[inset_0_-2px_0_rgba(255,170,0,0.8)]")}>
            <FileCode2 className="size-4 shrink-0" /><span className="truncate">{file.name}</span>{file.dirty && <span className="size-1.5 rounded-full bg-amber-core shadow-[0_0_8px_rgba(255,170,0,1)]" />}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-white/5 bg-black/20 p-3 md:block">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500 drop-shadow-sm"><Code2 className="size-3.5" /> Files</div>
          <div className="grid gap-1">
            {files.map((file) => (
              <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("truncate rounded-md px-2 py-2 text-left text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-white", activeFileId === file.id && "bg-white/[0.08] text-white shadow-sm")}>{file.path}</button>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.03] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Streaming Patch</p>
            <motion.div className="mt-3 h-1.5 rounded-full bg-amber-core" animate={{ width: ["20%", "94%", "45%", "78%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              {backendStatus === "online" ? "AI edits stream from Groq into the active Monaco buffer." : "Local editor cache active while backend reconnects."}
            </p>
          </div>
        </aside>
        <div className="min-w-0 flex h-full">
          <div className={cn("h-full transition-all duration-300 relative", showPreview ? "w-1/2 border-r border-white/5" : "w-full")}>
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              theme="vs-dark"
              onChange={(value: string | undefined) => updateFileContent(activeFile.id, value ?? "")}
              onMount={(editor, monaco) => {
                monaco.languages.registerInlineCompletionsProvider(activeFile.language, {
                  provideInlineCompletions: async (model, position, context, token) => {
                    const textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
                    const textAfterPosition = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: model.getLineCount(), endColumn: model.getLineMaxColumn(model.getLineCount()) });
                    
                    codeAmbersSocket.send({ type: "AI_AUTOCOMPLETE", prefix: textUntilPosition, suffix: textAfterPosition });
                    
                    return new Promise((resolve) => {
                      const unsub = codeAmbersSocket.subscribe((event) => {
                        if (event.type === "AUTOCOMPLETE_RESULT") {
                          unsub();
                          resolve({
                            items: [{ insertText: event.content }]
                          });
                        }
                      });
                      setTimeout(() => { unsub(); resolve({ items: [] }); }, 5000); // timeout
                    });
                  },
                  freeInlineCompletions: () => {}
                });
              }}
              options={{
                minimap: { enabled: true, scale: 0.75, renderCharacters: false },
                fontFamily: "Geist Mono, SFMono-Regular, Consolas, monospace",
                fontSize: 14,
                lineHeight: 24,
                padding: { top: 24, bottom: 24 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                renderLineHighlight: "all",
                overviewRulerBorder: false,
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
                formatOnPaste: true,
                formatOnType: true,
                inlineSuggest: { enabled: true },
              }}
            />
            <AnimatePresence>
              {(aiReview || loadingReview) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-amber-core/30 rounded-lg p-4 shadow-2xl z-10 w-96 max-h-[50vh] flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2 shrink-0">
                    <div className="flex items-center gap-2 text-amber-core text-sm font-semibold">
                      <ShieldAlert className="size-4" /> Security Reviewer
                    </div>
                    <button onClick={() => setAiReview(null)} className="text-zinc-500 hover:text-white"><X className="size-4"/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto min-h-0 text-sm text-zinc-200 leading-relaxed font-sans">
                    {loadingReview ? (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <div className="size-2 bg-amber-core rounded-full animate-ping" /> Analyzing code...
                      </div>
                    ) : (
                      aiReview
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {showPreview && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-1/2 h-full bg-white"
              >
                <SandpackProvider template="react" theme="light" files={getSandpackFiles()}>
                  <SandpackLayout style={{ height: "100%", border: "none", borderRadius: 0 }}>
                    <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} showRefreshButton={true} />
                  </SandpackLayout>
                </SandpackProvider>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
