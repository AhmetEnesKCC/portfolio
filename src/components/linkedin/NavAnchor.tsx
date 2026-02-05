"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/src/lib/utils";

export function NavAnchor({
  targetId,
  className,
  children,
  offsetPx = 72,
}: {
  targetId: string;
  className?: string;
  children: React.ReactNode;
  offsetPx?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <a
      href={`#${targetId}`}
      className={cn(className)}
      onClick={(e) => {
        const el = document.getElementById(targetId);
        if (!el) return; // fallback to default anchor

        e.preventDefault();

        const y = el.getBoundingClientRect().top + window.scrollY - offsetPx;
        window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });

        // Active-state'in "sayfa altındayım => son section" kuralına takılmaması için
        // kısa süreli scroll intent/lock sinyali.
        window.dispatchEvent(
          new CustomEvent("nav:jump", { detail: { id: targetId } }),
        );

        // URL hash'ini güncelle (router'a girmeden)
        try {
          const url = new URL(window.location.href);
          url.hash = targetId;
          window.history.replaceState({}, "", url.toString());
        } catch {
          // ignore
        }
      }}
    >
      {children}
    </a>
  );
}

