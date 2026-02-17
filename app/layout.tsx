import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmet Enes Keçeci",
  description: "Personal portfolio",
  openGraph: {
    title: "Ahmet Enes Keçeci",
    description: "Personal portfolio",
    url: "https://www.miruli.com",
    siteName: "Ahmet Enes Keçeci",
    images: [
      {
        url: "https://www.miruli.com/pp.png",
        width: 1200,
        height: 630,
        alt: "Ahmet Enes Keçeci Portfolio",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmet Enes Keçeci",
    description: "Personal portfolio",
    images: ["https://www.miruli.com/pp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
