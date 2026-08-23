"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ExperienceLevel = "student" | "fresher" | "experienced";

export function ExperienceSelector({ onComplete }: { onComplete: (level: ExperienceLevel) => void }) {
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  const levels = [
    {
      id: "student" as const,
      title: "Student",
      desc: "Learning the basics. AI agents will explain concepts simply and add detailed comments.",
      icon: GraduationCap
    },
    {
      id: "fresher" as const,
      title: "Fresher",
      desc: "Junior developer. AI will suggest best practices and guide architectural choices.",
      icon: Briefcase
    },
    {
      id: "experienced" as const,
      title: "Experienced",
      desc: "Senior engineer. AI will provide terse, optimized code without hand-holding.",
      icon: Code2
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-2xl rounded-2xl border border-white/10 bg-black/80 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-amber-core/10 mb-4">
            <Sparkles className="size-6 text-amber-core" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Personalize Your AI Agents</h2>
          <p className="mt-2 text-zinc-400">Select your experience level to calibrate the AI reasoning engine.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelected(level.id)}
              className={`flex flex-col text-left p-5 rounded-xl border transition-all ${
                selected === level.id 
                  ? "border-amber-core bg-amber-core/10 ring-1 ring-amber-core shadow-[0_0_15px_rgba(255,170,0,0.2)]" 
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <level.icon className={`size-6 mb-3 ${selected === level.id ? "text-amber-core" : "text-zinc-400"}`} />
              <h3 className={`font-semibold mb-1 ${selected === level.id ? "text-white" : "text-zinc-200"}`}>{level.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{level.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            disabled={!selected}
            onClick={() => selected && onComplete(selected)}
            className="px-8 disabled:opacity-50"
          >
            Configure Agents
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
