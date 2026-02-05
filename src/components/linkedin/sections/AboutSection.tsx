"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";
import type { Locale } from "@/src/i18n/locales";
import { cvText } from "@/src/i18n/cv-text";

export function AboutSection({
  title,
  summary,
  locale,
}: {
  title: string;
  summary: string;
  locale: Locale;
}) {
  return (
    <section id="about" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-zinc-200/90">
            {cvText(summary, locale)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

