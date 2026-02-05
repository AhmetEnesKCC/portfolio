"use client";

import type { CvSkillGroup } from "@/src/data/cv-types";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";

export function SkillsSection({
  title,
  skills,
}: {
  title: string;
  skills: CvSkillGroup[];
}) {
  if (!skills.length) return null;

  return (
    <section id="skills" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((group) => (
            <div key={group.category} className="space-y-2">
              <div className="text-sm font-medium text-zinc-200">
                {group.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={`${group.category}-${item}`}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

