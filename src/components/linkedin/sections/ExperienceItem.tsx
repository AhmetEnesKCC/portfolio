"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { CvExperience } from "@/src/data/cv-types";
import { getCompanyLogoPath } from "@/src/data/company-logos";
import type { Locale } from "@/src/i18n/locales";
import { formatDateRange } from "@/src/i18n/date-format";
import { cvText } from "@/src/i18n/cv-text";

function initials(input: string) {
  const parts = input
    .split(/[\s()]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "C";
  const second = parts[1]?.[0] ?? parts.at(-1)?.[0] ?? "O";
  return `${first}${second}`.toUpperCase();
}

export function ExperienceItem({
  item,
  locale,
}: {
  item: CvExperience;
  locale: Locale;
}) {
  const logoPath = getCompanyLogoPath(item.company);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="flex gap-3 rounded-xl px-2 py-2 -mx-2"
      whileHover={
        reduce
          ? undefined
          : {
              x: 2,
              backgroundColor: "rgba(255,255,255,0.04)",
            }
      }
      transition={
        reduce
          ? undefined
          : {
              type: "spring",
              stiffness: 360,
              damping: 30,
              mass: 0.6,
            }
      }
    >
      <div className="mt-0.5 flex shrink-0 flex-col items-center">
        {logoPath ? (
          <div className="grid size-11 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <Image
              src={logoPath}
              alt={`${item.company} logosu`}
              width={44}
              height={44}
              className="size-11 object-contain p-1.5"
            />
          </div>
        ) : (
          <div className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-200">
            {initials(item.company)}
          </div>
        )}
        <div className="mt-2 hidden text-zinc-600 sm:block">
          <Building2 className="size-4" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-50">
              {cvText(item.title, locale)}
            </div>
            <div className="truncate text-sm text-zinc-300">{item.company}</div>
          </div>
          <div className="shrink-0 text-xs text-zinc-400">
            {formatDateRange(item.dateRange, locale)}
          </div>
        </div>

        {item.bullets.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-200/90">
            {item.bullets.map((b) => (
              <li key={`${item.id}-${b}`}>{cvText(b, locale)}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

