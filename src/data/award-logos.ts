function normalizeAwardTitle(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()|]/g, " ")
    .replace(/[^a-z0-9\s]+/g, "")
    .trim();
}

/**
 * Hackathon/Award title -> logo path eşlemesi.
 * Logoları `public/logos/...` altına koy.
 */
const AWARD_LOGO_MAP: Array<{ match: (t: string) => boolean; path: string }> = [
  {
    match: (t) => normalizeAwardTitle(t).includes("ethglobal"),
    path: "/logos/ethglobal.jpg",
  },
  {
    match: (t) => normalizeAwardTitle(t).includes("ethberlin"),
    path: "/logos/ethberlin.png",
  },
  {
    match: (t) => normalizeAwardTitle(t).includes("hackjuno"),
    path: "/logos/hackjuno.jpg",
  },
];

export function getAwardLogoPath(title: string) {
  for (const entry of AWARD_LOGO_MAP) {
    if (entry.match(title)) return entry.path;
  }
  return undefined;
}

