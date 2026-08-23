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
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.04] px-5 py-4 bg-white/[0.01]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Live Workspace</p>
          <h2 className="mt-1 text-[15px] font-medium text-zinc-100 tracking-wide">Monaco Code Surface</h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={reviewCode}
            disabled={loadingReview}
            className="floating-btn flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[13px] font-medium text-amber-500 transition hover:bg-amber-500/10"
          >
            <ShieldAlert className="size-3.5" /> {loadingReview ? "Reviewing..." : "Review Code"}
          </button>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={cn("floating-btn flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-300", showPreview ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-white/[0.04] bg-white/[0.02] text-zinc-400 hover:text-zinc-200")}
          >
            {showPreview ? <><EyeOff className="size-3.5" /> Close Preview</> : <><Eye className="size-3.5" /> Live Preview</>}
          </button>
          {[Search, SplitSquareHorizontal, Maximize2, Play].map((Icon, index) => (
            <button key={index} className="floating-btn grid size-8 place-items-center rounded-lg border border-white/[0.04] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 transition-colors"><Icon className="size-3.5" /></button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 border-b border-white/[0.04] bg-black/40 px-3 py-2 gap-2">
        {files.map((file) => (
          <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("flex min-w-0 items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200", activeFileId === file.id ? "bg-white/[0.08] text-zinc-100 shadow-sm border border-white/[0.04]" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 border border-transparent")}>
            <FileCode2 className="size-3.5 shrink-0" /><span className="truncate">{file.name}</span>{file.dirty && <span className="size-1.5 rounded-full bg-amber-400" />}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-white/[0.04] bg-white/[0.01] p-4 md:block">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500"><Code2 className="size-3.5" /> Files</div>
          <div className="grid gap-1">
            {files.map((file) => (
              <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("truncate rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-colors duration-200", activeFileId === file.id ? "bg-white/[0.06] text-zinc-100" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300")}>{file.path}</button>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 shadow-inner">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Streaming Patch</p>
            <div className="mt-4 h-1 w-full rounded-full bg-black/50 overflow-hidden relative border border-white/[0.05]">
               <motion.div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-orange-400" animate={{ width: ["15%", "85%", "35%", "95%"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed font-medium text-zinc-500">
              {backendStatus === "online" ? "AI edits stream from Groq into the active Monaco buffer." : "Local editor cache active while backend reconnects."}
            </p>
          </div>
        </aside>
        <div className="min-w-0 flex h-full bg-[#0a0a0c]">
          <div className={cn("h-full transition-all duration-300 relative", showPreview ? "w-1/2 border-r border-white/[0.04]" : "w-full")}>
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              theme="vs-dark"
              onChange={(value: string | undefined) => updateFileContent(activeFile.id, value ?? "")}
              onMount={(editor, monaco) => {
                monaco.languages.registerInlineCompletionsProvider(activeFile.language, {
                  provideInlineCompletions: async (model: any, position: any, context: any, token: any) => {
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
