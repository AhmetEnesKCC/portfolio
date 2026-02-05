import { LinkedInProfilePage } from "@/src/components/linkedin/LinkedInProfilePage";
import { getCvData } from "@/src/data/cv-data";
import { isLocale, type Locale } from "@/src/i18n/locales";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "tr";
  const cv = await getCvData();
  return <LinkedInProfilePage cv={cv} locale={safeLocale} />;
}

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

