"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/linkedin/sections/SectionTitle";
import type { Locale } from "@/src/i18n/locales";

export function MiruliSection({ title, locale }: { title: string; locale: Locale }) {
  return (
    <section id="miruli" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <SectionTitle>{title}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {locale === "en" ? <ContentEn /> : <ContentTr />}
        </CardContent>
      </Card>
    </section>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-zinc-200">
      {children}
    </div>
  );
}

function ContentTr() {
  return (
    <>
      <p className="text-sm leading-6 text-zinc-200/90">
        <strong className="text-zinc-50">miruli</strong> mahlası, iki parçanın
        birleşiminden doğuyor: <strong className="text-zinc-50">mira</strong>{" "}
        (ocean / okyanus) ve <strong className="text-zinc-50">uli</strong>{" "}
        (over / ötesi).
      </p>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-zinc-300">
          Matematiksel okuma
        </div>
        <Formula>miruli = mira ⊕ uli</Formula>
        <p className="text-sm leading-6 text-zinc-200/90">
          Buradaki <span className="font-mono text-xs text-zinc-200">⊕</span>,
          “yan yana ekleme/kompozisyon” gibi düşünülebilir: iki anlam parçası bir
          araya gelince yeni bir kimlik üretiyor. Sonuç, parçaların basit
          toplamından çok bir <em>birleşim</em>: okyanus gibi geniş bir bakış ve
          “ötesine geçme” dürtüsü.
        </p>
      </div>

      <p className="text-sm leading-6 text-zinc-200/90">
        Kısacası: <span className="font-semibold text-zinc-50">miruli</span>,
        geniş perspektifi ve üretim gücünü; sınırların ötesine uzanan, sakin ama
        kararlı bir imzaya dönüştürüyor.
      </p>
    </>
  );
}

function ContentEn() {
  return (
    <>
      <p className="text-sm leading-6 text-zinc-200/90">
        The handle <strong className="text-zinc-50">miruli</strong> is formed by
        combining two parts: <strong className="text-zinc-50">mira</strong>{" "}
        (“ocean”) and <strong className="text-zinc-50">uli</strong> (“over /
        beyond”).
      </p>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-zinc-300">
          Mathematical reading
        </div>
        <Formula>miruli = mira ⊕ uli</Formula>
        <p className="text-sm leading-6 text-zinc-200/90">
          Here, <span className="font-mono text-xs text-zinc-200">⊕</span> can be
          read as “composition/concatenation”: two semantic components combine
          to produce a new identity. The result is not just a sum—it’s a{" "}
          <em>merge</em>: an ocean-wide perspective with a bias toward going{" "}
          <em>beyond</em>.
        </p>
      </div>

      <p className="text-sm leading-6 text-zinc-200/90">
        In short: <span className="font-semibold text-zinc-50">miruli</span> is a
        minimal signature that points to breadth of vision and a steady drive to
        build beyond the obvious.
      </p>
    </>
  );
}

