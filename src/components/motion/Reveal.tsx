"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/src/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 10,
  scaleFrom = 0.98,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scaleFrom?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, scale: scaleFrom }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 34,
        mass: 0.6,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

