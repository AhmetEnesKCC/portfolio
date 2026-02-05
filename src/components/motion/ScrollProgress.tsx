"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left"
      style={{
        scaleX: scrollYProgress,
        backgroundImage:
          "linear-gradient(90deg, rgba(168,85,247,0.55), rgba(34,211,238,0.55), rgba(34,197,94,0.45), rgba(59,130,246,0.5))",
        boxShadow: "0 0 14px rgba(34, 211, 238, 0.12)",
      }}
    />
  );
}

