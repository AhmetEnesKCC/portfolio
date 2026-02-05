"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/src/i18n/locales";

function switchLocaleInPath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${nextLocale}`;
  if (parts[0] === "tr" || parts[0] === "en") parts[0] = nextLocale;
  else parts.unshift(nextLocale);
  return `/${parts.join("/")}`;
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "tr" ? "en" : "tr";

  return (
    <Link
      href={switchLocaleInPath(pathname, nextLocale)}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
      aria-label="Dil değiştir"
    >
      {locale === "tr" ? "EN" : "TR"}
    </Link>
  );
}

