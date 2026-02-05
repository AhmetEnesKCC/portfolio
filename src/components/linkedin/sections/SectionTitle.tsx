"use client";

import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold tracking-tight text-zinc-50">
        {children}
      </h2>
    </div>
  );
}

