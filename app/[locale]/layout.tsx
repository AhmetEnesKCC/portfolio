import type { ReactNode } from "react";

import { isLocale, type Locale } from "@/src/i18n/locales";
import { getDictionary } from "@/src/i18n/dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "tr";
  const dict = getDictionary(safeLocale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "tr";

  return (
    <div data-locale={safeLocale} className="min-h-screen">
      {children}
    </div>
  );
}

