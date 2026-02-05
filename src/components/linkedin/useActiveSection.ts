"use client";

import { useEffect, useMemo, useState } from "react";

export function useActiveSection<T extends string>(
  sectionIds: T[],
  options?: { topOffsetPx?: number },
) {
  const ids = useMemo(() => sectionIds, [sectionIds.join(",")]);
  const [active, setActive] = useState<T>(ids[0] as T);

  useEffect(() => {
    if (!ids.length) return;

    const topOffsetPx = options?.topOffsetPx ?? 72; // sticky nav + padding
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    // Precompute absolute Y positions (and update on resize).
    let positions: Array<{ id: T; top: number }> = [];
    let lock: { id: T; until: number } | null = null;
    const compute = () => {
      positions = els
        .map((el) => ({
          id: el.id as T,
          top: el.getBoundingClientRect().top + window.scrollY,
        }))
        .sort((a, b) => a.top - b.top);
    };
    compute();

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;

        // Eğer kullanıcı navbar'dan bir hedefe "jump" ettiyse kısa süreli lock uygula.
        if (lock && Date.now() < lock.until) {
          setActive(lock.id);
          return;
        }

        const y = window.scrollY + topOffsetPx + 1;
        const docBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;

        // Sayfa en altına gelince: son section active olsun.
        if (docBottom) {
          setActive(positions.at(-1)!.id);
          return;
        }

        // Normalde: current y'den küçük/eşit olan en son section.
        let current = positions[0]!.id;
        for (const p of positions) {
          if (p.top <= y) current = p.id;
          else break;
        }
        setActive(current);
      });
    };

    const onResize = () => {
      compute();
      onScroll();
    };

    const onNavJump = (e: Event) => {
      const ce = e as CustomEvent<{ id?: string }>;
      const id = ce.detail?.id;
      if (!id) return;
      if (!ids.includes(id as T)) return;
      lock = { id: id as T, until: Date.now() + 900 };
      setActive(id as T);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("nav:jump", onNavJump as EventListener);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("nav:jump", onNavJump as EventListener);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [ids, options?.topOffsetPx]);

  return active;
}

