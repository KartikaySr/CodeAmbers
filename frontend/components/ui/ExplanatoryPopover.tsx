"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

interface ExplanatoryPopoverProps {
  children: React.ReactNode;
  title: string;
  description: string;
  metadata?: Record<string, string>;
}

export function ExplanatoryPopover({ children, title, description, metadata }: ExplanatoryPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen) setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef} onClick={handleClick} className="inline-block cursor-help relative z-10">
        {children}
      </div>
      
      {/* We use a React portal approach implicitly here by rendering absolute to body, but for simplicity we render fixed relative to viewport */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 w-72 rounded-xl border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-core">
                <Info className="size-4" />
                <h4 className="font-medium text-sm text-white">{title}</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              {description}
            </p>

            {metadata && (
              <div className="mt-3 grid gap-1.5 border-t border-white/10 pt-3">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">{key}</span>
                    <span className="font-mono text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
