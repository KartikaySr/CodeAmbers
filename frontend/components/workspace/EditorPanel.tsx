"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Code2, FileCode2, Maximize2, Play, Search, SplitSquareHorizontal, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-[#050505] font-mono text-sm text-zinc-500">Warming Monaco editor...</div>
});

export function EditorPanel() {
  const { files, activeFile, activeFileId, setActiveFile, updateFileContent, backendStatus } = useWorkspace();
  const [showPreview, setShowPreview] = useState(false);

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
    <section className="flex h-full min-h-0 flex-col bg-black">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-core">Live Workspace</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Monaco Code Surface</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={cn("flex items-center gap-2 rounded-lg border border-white/5 px-3 py-1.5 text-xs font-medium transition", showPreview ? "bg-amber-core text-black hover:bg-amber-500" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white")}
          >
            {showPreview ? <><EyeOff className="size-3.5" /> Close Preview</> : <><Eye className="size-3.5" /> Live Preview</>}
          </button>
          {[Search, SplitSquareHorizontal, Maximize2, Play].map((Icon, index) => (
            <button key={index} className="grid size-9 place-items-center rounded-lg border border-white/5 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"><Icon className="size-4" /></button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 border-b border-white/5 bg-white/[0.025]">
        {files.map((file) => (
          <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("flex min-w-0 items-center gap-2 border-r border-white/5 px-4 py-3 text-sm text-zinc-500 transition hover:bg-white/[0.05] hover:text-white", activeFileId === file.id && "bg-amber-core/10 text-amber-100")}>
            <FileCode2 className="size-4 shrink-0" /><span className="truncate">{file.name}</span>{file.dirty && <span className="size-1.5 rounded-full bg-amber-core" />}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-white/5 bg-[#050505] p-3 md:block">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500"><Code2 className="size-3.5" /> Files</div>
          <div className="grid gap-1">
            {files.map((file) => (
              <button key={file.id} onClick={() => setActiveFile(file.id)} className={cn("truncate rounded-md px-2 py-2 text-left text-xs text-zinc-500 hover:bg-white/[0.05] hover:text-white", activeFileId === file.id && "bg-white/[0.06] text-zinc-200")}>{file.path}</button>
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
          <div className={cn("h-full transition-all duration-300", showPreview ? "w-1/2 border-r border-white/5" : "w-full")}>
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              theme="vs-dark"
              onChange={(value: string | undefined) => updateFileContent(activeFile.id, value ?? "")}
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
              }}
            />
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
