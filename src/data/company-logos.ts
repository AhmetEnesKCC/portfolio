function normalizeCompanyName(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()|]/g, " ")
    .replace(/[^a-z0-9\s]+/g, "")
    .trim();
}

/**
 * Şirket adı -> logo path eşlemesi.
 * Logoları `public/logos/...` altına koy.
 *
 * Örn: public/logos/tinylabs.png  => "/logos/tinylabs.png"
 */
const COMPANY_LOGO_MAP: Record<string, string> = {
  [normalizeCompanyName("TinyLabs")]: "/logos/tinylabs.jpg",
  [normalizeCompanyName("Vanora Ventures")]: "/logos/vanora-ventures.jpg",
  [normalizeCompanyName("Chainify")]: "/logos/chainify.jpg",
  [normalizeCompanyName("Onlyjs")]: "/logos/onlyjs.jpg",
};

export function getCompanyLogoPath(companyName: string) {
  const normalized = normalizeCompanyName(companyName);

  // 1) Tam eşleşme
  const direct = COMPANY_LOGO_MAP[normalized];
  if (direct) return direct;

  // 2) "TinyLabs (SAM Terminal)" gibi varyantlar için: normalized string içinde anahtar arama.
  // En uzun anahtarı seçerek yanlış eşleşme riskini azaltıyoruz.
  let bestKey: string | undefined;
  for (const key of Object.keys(COMPANY_LOGO_MAP)) {
    if (!key) continue;
    if (normalized === key) return COMPANY_LOGO_MAP[key];
    if (normalized.includes(key)) {
      if (!bestKey || key.length > bestKey.length) bestKey = key;
    }
  }

  return bestKey ? COMPANY_LOGO_MAP[bestKey] : undefined;
}

