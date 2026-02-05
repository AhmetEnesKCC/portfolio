"use client";

import type { CvExperience } from "@/src/data/cv-types";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { ExperienceItem } from "@/src/components/linkedin/sections/ExperienceItem";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";
import type { Locale } from "@/src/i18n/locales";
import { StaggerItem, StaggerList } from "@/src/components/animations/Reveal";

export function ExperienceSection({
  title,
  locale,
  items,
}: {
  title: string;
  locale: Locale;
  items: CvExperience[];
}) {
  if (!items.length) return null;

  return (
    <section id="experience" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StaggerList className="space-y-6">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <ExperienceItem item={item} locale={locale} />
              </StaggerItem>
            ))}
          </StaggerList>
        </CardContent>
      </Card>
    </section>
  );
}

