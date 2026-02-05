"use client";

import Image from "next/image";

import type { CvAward } from "@/src/data/cv-types";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";
import { getAwardLogoPath } from "@/src/data/award-logos";
import type { Locale } from "@/src/i18n/locales";
import { formatDateRange } from "@/src/i18n/date-format";
import { cvText } from "@/src/i18n/cv-text";

function initials(input: string) {
  const parts = input
    .split(/[\s()]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "A";
  const second = parts[1]?.[0] ?? parts.at(-1)?.[0] ?? "W";
  return `${first}${second}`.toUpperCase();
}

export function AwardsSection({
  title,
  locale,
  items,
}: {
  title: string;
  locale: Locale;
  items: CvAward[];
}) {
  if (!items.length) return null;

  return (
    <section id="awards" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((a) => (
            <AwardRow key={a.id} a={a} locale={locale} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function AwardRow({ a, locale }: { a: CvAward; locale: Locale }) {
  const logoPath = getAwardLogoPath(a.title);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 gap-3">
        {logoPath ? (
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <Image
              src={logoPath}
              alt={`${a.title} logosu`}
              width={44}
              height={44}
              className="size-11 object-contain p-1.5"
            />
          </div>
        ) : (
          <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-200">
            {initials(a.title)}
          </div>
        )}

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-50">
            {a.title}
          </div>
          {a.detail && (
            <div className="truncate text-sm text-zinc-300">
              {cvText(a.detail, locale)}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 text-xs text-zinc-400">
        {formatDateRange(a.date, locale)}
      </div>
    </div>
  );
}

