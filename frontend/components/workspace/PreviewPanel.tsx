"use client";

import { useState, useEffect, useRef } from "react";
import { Monitor, Smartphone, Maximize2, ExternalLink } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";

export function PreviewPanel() {
  const { activeFile } = useWorkspace();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // When the active file changes, if it's HTML, update the iframe
  useEffect(() => {
    if (activeFile && (activeFile.language === "html" || activeFile.name.endsWith(".html"))) {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        doc.open();
        doc.write(activeFile.content);
        doc.close();
      }
    } else if (activeFile && (activeFile.language === "javascript" || activeFile.language === "typescript" || activeFile.language === "css")) {
       // Ideally we'd bundle, but for now we'll just show a placeholder or basic preview for non-html files
       const doc = iframeRef.current?.contentDocument;
       if (doc) {
         doc.open();
         doc.write(`
           <html>
             <head>
               <style>
                 body { font-family: system-ui, sans-serif; color: #fff; background: #111; display: grid; place-items: center; height: 100vh; margin: 0; }
               </style>
             </head>
             <body>
               <div style="text-align: center;">
                 <h2 style="color: #fbbf24;">Live Preview</h2>
                 <p style="color: #a1a1aa;">Currently viewing a ${activeFile.language} file.</p>
                 <p style="color: #a1a1aa; font-size: 0.9em;">(Live preview is optimized for HTML files. Switch to an HTML file to see the render)</p>
               </div>
             </body>
           </html>
         `);
         doc.close();
       }
    }
  }, [activeFile]);

  return (
    <div className="glass floating-panel flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-white/10 bg-black/20 p-0.5">
            <button
              onClick={() => setViewMode("desktop")}
              className={cn(
                "rounded p-1.5 transition-colors",
                viewMode === "desktop" ? "bg-white/10 text-amber-core" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Monitor className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={cn(
                "rounded p-1.5 transition-colors",
                viewMode === "mobile" ? "bg-white/10 text-amber-core" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Smartphone className="size-4" />
            </button>
          </div>
          <span className="ml-2 font-mono text-xs text-zinc-400">
            {viewMode === "desktop" ? "100% (Desktop)" : "375px (Mobile)"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-500">
          <button className="rounded p-1.5 hover:bg-white/5 hover:text-white transition-colors">
            <Maximize2 className="size-4" />
          </button>
          <button className="rounded p-1.5 hover:bg-white/5 hover:text-white transition-colors">
            <ExternalLink className="size-4" />
          </button>
        </div>
      </div>
      
      <div className="flex min-h-0 flex-1 items-center justify-center bg-black/80 overflow-y-auto p-4">
        <div 
          className={cn(
            "h-full rounded-lg border border-white/10 bg-white transition-all duration-300 shadow-2xl overflow-hidden",
            viewMode === "desktop" ? "w-full" : "w-[375px]"
          )}
        >
          <iframe 
            ref={iframeRef}
            className="h-full w-full border-none bg-white"
            title="Preview"
            sandbox="allow-scripts allow-modals allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
