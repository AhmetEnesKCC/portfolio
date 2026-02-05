"use client";

import Image from "next/image";

import type { CvEducation } from "@/src/data/cv-types";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";
import { getSchoolLogoPath } from "@/src/data/education-logos";
import type { Locale } from "@/src/i18n/locales";
import { formatDateRange } from "@/src/i18n/date-format";
import { cvText } from "@/src/i18n/cv-text";

function initials(input: string) {
  const parts = input
    .split(/[\s()]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? parts.at(-1)?.[0] ?? "N";
  return `${first}${second}`.toUpperCase();
}

export function EducationSection({
  title,
  locale,
  items,
}: {
  title: string;
  locale: Locale;
  items: CvEducation[];
}) {
  if (!items.length) return null;

  return (
    <section id="education" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((ed) => (
            <EducationRow key={ed.id} ed={ed} locale={locale} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function EducationRow({ ed, locale }: { ed: CvEducation; locale: Locale }) {
  const logoPath = getSchoolLogoPath(ed.school);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 gap-3">
        {logoPath ? (
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <Image
              src={logoPath}
              alt={`${ed.school} logosu`}
              width={44}
              height={44}
              className="size-11 object-contain p-1.5"
            />
          </div>
        ) : (
          <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-200">
            {initials(ed.school)}
          </div>
        )}

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-50">
            {cvText(ed.school, locale)}
          </div>
          <div className="truncate text-sm text-zinc-300">
            {cvText(ed.degree, locale)}
          </div>
          <div className="truncate text-xs text-zinc-400">{ed.location}</div>
        </div>
      </div>

      <div className="shrink-0 text-xs text-zinc-400">
        {formatDateRange(ed.dateRange, locale)}
      </div>
    </div>
  );
}

