"use client";

import { useMemo, useState } from "react";
import { Github, Link2, Mail, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { CvProfile } from "@/src/data/cv-types";
import { Card, CardContent } from "@/src/components/ui/card";
import type { Locale } from "@/src/i18n/locales";
import { cvText } from "@/src/i18n/cv-text";

function initialsFromName(name: string) {
  const parts = name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "A";
  const last = parts.at(-1)?.[0] ?? "E";
  return `${first}${last}`.toUpperCase();
}

function displayUrl(url: string) {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
}

function telHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");
  return `tel:${compact}`;
}

export function ProfileHeroCard({
  profile,
  locale,
}: {
  profile: CvProfile;
  locale: Locale;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = useMemo(() => initialsFromName(profile.name), [profile.name]);
  const reduce = useReducedMotion();

  return (
    <Card className="overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-10 opacity-30 blur-2xl [background:radial-gradient(circle_at_15%_25%,rgba(168,85,247,0.35),transparent_45%),radial-gradient(circle_at_65%_20%,rgba(34,211,238,0.30),transparent_42%),radial-gradient(circle_at_85%_70%,rgba(34,197,94,0.22),transparent_48%),radial-gradient(circle_at_35%_80%,rgba(59,130,246,0.26),transparent_50%)]"
          animate={reduce ? undefined : { x: [0, 10, 0], y: [0, -8, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 18,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <CardContent className="relative">
        {/* Avatar */}
        <div className="-mt-14 mb-3 flex items-end justify-between gap-4">
          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-zinc-950 p-1 shadow-sm">
              <div className="grid size-28 place-items-center overflow-hidden rounded-xl bg-white/5">
                {imgError ? (
                  <span className="text-xl font-semibold text-zinc-100">
                    {initials}
                  </span>
                ) : (
                  // `pp.png` CV'de referanslı. Dosya yoksa fallback gösteriyoruz.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/pp.png"
                    alt={`${profile.name} profil fotoğrafı`}
                    className="size-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            {profile.name}
          </h1>
          <p className="text-sm text-zinc-200/90">
            {cvText(profile.headline, locale)}
          </p>
          <p className="text-sm text-zinc-400">{profile.location}</p>
        </div>

        {(profile.email || profile.phone || profile.linkedin || profile.github) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
              >
                <Mail className="size-4 text-zinc-300" />
                <span className="truncate">{profile.email}</span>
              </a>
            )}

            {profile.phone && (
              <a
                href={telHref(profile.phone)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
              >
                <Phone className="size-4 text-zinc-300" />
                <span className="truncate">{profile.phone}</span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
              >
                <Link2 className="size-4 text-zinc-300" />
                <span className="truncate">{displayUrl(profile.linkedin)}</span>
              </a>
            )}

            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
              >
                <Github className="size-4 text-zinc-300" />
                <span className="truncate">{displayUrl(profile.github)}</span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

