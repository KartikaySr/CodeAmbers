import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { Particles } from "@/components/effects/Particles";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="noise relative min-h-screen overflow-hidden bg-black">
      <AmbientBackground intensity="strong" />
      <Particles />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
