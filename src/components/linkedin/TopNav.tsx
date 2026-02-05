"use client";

import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";

import type { Locale } from "@/src/i18n/locales";
import { getDictionary } from "@/src/i18n/dictionary";
import { LocaleSwitcher } from "@/src/components/linkedin/LocaleSwitcher";
import { ScrollProgress } from "@/src/components/motion/ScrollProgress";
import { useActiveSection } from "@/src/components/linkedin/useActiveSection";
import { cn } from "@/src/lib/utils";
import { NavAnchor } from "@/src/components/linkedin/NavAnchor";

const navIcons = {
  about: User,
  skills: Sparkles,
  experience: BriefcaseBusiness,
  education: GraduationCap,
  awards: Award,
} as const;

export function TopNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const active = useActiveSection([
    "about",
    "skills",
    "experience",
    "education",
    "awards",
  ]);
  const navItems = [
    { id: "about", href: "#about", label: dict.nav.about, Icon: navIcons.about },
    {
      id: "skills",
      href: "#skills",
      label: dict.nav.skills,
      Icon: navIcons.skills,
    },
    {
      id: "experience",
      href: "#experience",
      label: dict.nav.experience,
      Icon: navIcons.experience,
    },
    {
      id: "education",
      href: "#education",
      label: dict.nav.education,
      Icon: navIcons.education,
    },
    { id: "awards", href: "#awards", label: dict.nav.awards, Icon: navIcons.awards },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[920px] items-center justify-between px-4">
        <NavAnchor
          targetId="top"
          className="flex items-center gap-2 font-semibold tracking-tight text-zinc-50"
        >
          <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm">
            AE
          </span>
          <span className="hidden sm:block">{dict.brand.profile}</span>
        </NavAnchor>

        <nav className="flex items-center gap-1">
          {navItems.map(({ id, href, label, Icon }) => (
            <NavAnchor
              key={href}
              targetId={id}
              aria-current={active === id ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                active === id
                  ? "bg-white/10 text-zinc-50"
                  : "text-zinc-300 hover:bg-white/5 hover:text-zinc-50",
              )}
            >
              <Icon className="size-4 opacity-90" />
              <span className="hidden md:block">{label}</span>
            </NavAnchor>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}

