function normalizeSchoolName(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()|]/g, " ")
    .replace(/[^a-z0-9\s]+/g, "")
    .trim();
}

/**
 * Okul adı -> logo path eşlemesi.
 * Logoları `public/logos/...` altına koy.
 */
const SCHOOL_LOGO_MAP: Record<string, string> = {
  [normalizeSchoolName("Istanbul Technical University")]: "/logos/itu.png",
};

export function getSchoolLogoPath(schoolName: string) {
  const normalized = normalizeSchoolName(schoolName);
  const direct = SCHOOL_LOGO_MAP[normalized];
  if (direct) return direct;

  // Varyant isimler için kapsama araması (en uzun anahtar)
  let bestKey: string | undefined;
  for (const key of Object.keys(SCHOOL_LOGO_MAP)) {
    if (normalized.includes(key)) {
      if (!bestKey || key.length > bestKey.length) bestKey = key;
    }
  }
  return bestKey ? SCHOOL_LOGO_MAP[bestKey] : undefined;
}

