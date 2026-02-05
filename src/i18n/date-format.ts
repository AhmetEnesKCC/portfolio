import type { Locale } from "@/src/i18n/locales";

const MONTH_TR: Record<string, string> = {
  Jan: "Oca",
  Feb: "Şub",
  Mar: "Mar",
  Apr: "Nis",
  May: "May",
  Jun: "Haz",
  Jul: "Tem",
  Aug: "Ağu",
  Sep: "Eyl",
  Oct: "Eki",
  Nov: "Kas",
  Dec: "Ara",
};

export function formatDateRange(dateRange: string, locale: Locale) {
  if (locale === "en") return dateRange;

  let out = dateRange;
  out = out.replace(/\bPresent\b/g, "Günümüz");
  out = out.replace(/\bExpected\b/g, "Beklenen");
  out = out.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) =>
    MONTH_TR[m] ? MONTH_TR[m] : m,
  );
  return out;
}

