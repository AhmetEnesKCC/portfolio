"use client";

import { motion } from "framer-motion";

import type { CvData } from "@/src/data/cv-types";
import { ProfileHeroCard } from "@/src/components/linkedin/ProfileHeroCard";
import { TopNav } from "@/src/components/linkedin/TopNav";
import { AboutSection } from "@/src/components/linkedin/sections/AboutSection";
import { SkillsSection } from "@/src/components/linkedin/sections/SkillsSection";
import { ExperienceSection } from "@/src/components/linkedin/sections/ExperienceSection";
import { EducationSection } from "@/src/components/linkedin/sections/EducationSection";
import { AwardsSection } from "@/src/components/linkedin/sections/AwardsSection";
import { MiruliSection } from "@/src/components/linkedin/sections/MiruliSection";
import type { Locale } from "@/src/i18n/locales";
import { getDictionary } from "@/src/i18n/dictionary";
import { Reveal } from "@/src/components/animations/Reveal";
import { AmbientBackground } from "@/src/components/animations/AmbientBackground";
import { AiAssistantFab } from "@/src/components/linkedin/AiAssistantFab";

export function LinkedInProfilePage({
  cv,
  locale,
}: {
  cv: CvData;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <div id="top" className="min-h-screen">
      <AmbientBackground />
      <TopNav locale={locale} />
      <AiAssistantFab locale={locale} />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-[920px] flex-col gap-4 px-4 py-6"
      >
        <Reveal y={6} scaleFrom={0.985}>
          <ProfileHeroCard profile={cv.profile} locale={locale} />
        </Reveal>

        <Reveal delay={0.02}>
          <AboutSection
            title={dict.sections.about}
            summary={cv.professionalSummary}
            locale={locale}
          />
        </Reveal>

        <Reveal delay={0.04}>
          <SkillsSection title={dict.sections.skills} skills={cv.skills} />
        </Reveal>

        <Reveal delay={0.06}>
          <ExperienceSection
            title={dict.sections.experience}
            locale={locale}
            items={cv.experience}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <EducationSection
            title={dict.sections.education}
            locale={locale}
            items={cv.education}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <AwardsSection
            title={dict.sections.awards}
            locale={locale}
            items={cv.awards}
          />
        </Reveal>

        <Reveal delay={0.12}>
          <MiruliSection title={dict.sections.miruli} locale={locale} />
        </Reveal>
      </motion.main>
    </div>
  );
}

