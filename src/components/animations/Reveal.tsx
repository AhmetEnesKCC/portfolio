"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/src/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scaleFrom?: number;
};

/**
 * Kıdemli / sober hissi için: hızlı, doğal spring; minimum mesafe; düşük scale.
 * Reduced-motion'da animasyon yok.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 10,
  scaleFrom = 0.98,
}: RevealProps) {
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

type StaggerListProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
  stagger?: number;
  delayChildren?: number;
};

export function StaggerList({
  children,
  className,
  once = true,
  amount = 0.25,
  stagger = 0.06,
  delayChildren = 0.02,
}: StaggerListProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  scaleFrom?: number;
};

export function StaggerItem({
  children,
  className,
  y = 10,
  scaleFrom = 0.98,
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y, scale: scaleFrom },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 320,
            damping: 34,
            mass: 0.6,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

