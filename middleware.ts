import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["tr", "en"] as const;
const DEFAULT_LOCALE = "tr";

function getPreferredLocale(req: NextRequest) {
  const header = req.headers.get("accept-language") ?? "";
  const lower = header.toLowerCase();
  if (lower.includes("tr")) return "tr";
  if (lower.includes("en")) return "en";
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip next internals & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  const locale = getPreferredLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

