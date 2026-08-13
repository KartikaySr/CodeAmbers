import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-10 place-items-center rounded-lg border border-amber-core/30 bg-amber-core/10 shadow-amber">
        <Flame className="size-5 text-amber-core" />
        <span className="absolute inset-0 rounded-lg bg-amber-core/20 blur-xl" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-sm font-semibold tracking-wide text-white">CodeAmbers</span>
          <span className="block pt-1 text-[10px] uppercase tracking-[0.24em] text-zinc-500">Autonomous OS</span>
        </span>
      )}
    </Link>
  );
}
