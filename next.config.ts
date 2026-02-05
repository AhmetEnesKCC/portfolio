import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Workspace root yanlış algılanınca (üst dizindeki lockfile yüzünden) uyarı çıkıyor.
    // Bu ayar, projeyi bu klasöre sabitliyor.
    root: process.cwd(),
  },
};

export default nextConfig;
