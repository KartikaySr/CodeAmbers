"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  top: `${(index * 43) % 100}%`,
  delay: (index % 9) * 0.4
}));

export function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span key={particle.id} className="absolute size-1 rounded-full bg-white/40" style={{ left: particle.left, top: particle.top }} animate={{ y: [-10, 18, -10], opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.5, 0.8] }} transition={{ duration: 5 + (particle.id % 5), repeat: Infinity, delay: particle.delay }} />
      ))}
    </div>
  );
}
