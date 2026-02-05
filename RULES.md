# Proje Kuralları (Portfolio / Personal LinkedIn)

Bu doküman, projede **tutarlılık**, **bakım kolaylığı** ve “senior engineer sobriety” çizgisini korumak için kuralları tanımlar.

## 1) Tek Kaynak: CV Verisi
- **Tek gerçek kaynak**: `cv.latex`
- CV içeriği UI’da **hardcode edilmez**.
- CV’den gelen tüm profesyonel veri `src/data/cv-data.ts` üzerinden parse edilir ve `CvData` olarak kullanılır.
- Yeni bir bölüm eklemek istiyorsan önce `cv.latex`’e ekle, sonra parser’ı genişlet.

## 2) Tech Stack
- **Framework**: Next.js (App Router)
- **UI**: TailwindCSS v4 (CSS variables + utility-first)
- **Animasyon**: `framer-motion`
- **Icon**: `lucide-react`
- **AI**: `@google/generative-ai` (Gemini)
- **Dil**: TypeScript

## 3) Routing ve i18n
- Locale route’ları: `/tr` ve `/en`
- `/` isteği, `middleware.ts` ile dil tercihine göre locale’e yönlenir.
- UI string’leri `src/i18n/dictionary.ts` içinden gelir.
- Tarih formatı ve “Present/Expected” gibi ifadeler `src/i18n/date-format.ts` ile TR’de lokalize edilir.
- CV metni TR’de daha doğal olsun diye birebir eşleme katmanı: `src/i18n/cv-text.ts`

## 4) UI/UX Tasarım Sistemi (LinkedIn-esque Dark)
- Layout: merkez kolon `max-w-[920px]`, kart bazlı içerik.
- Her ana bölüm **Card** içinde olmalı: `src/components/ui/card.tsx`
- Minimal border (`border-white/10`), `rounded-2xl`, “dark glass” arkaplan yaklaşımı.
- Responsive: mobilde dikey akış; navbar linkleri küçük ekranlarda label’ı gizleyebilir.

## 5) Bileşen Mimarisi ve Modülerlik
- LinkedIn sayfa bileşenleri: `src/components/linkedin/*`
- Section’lar: `src/components/linkedin/sections/*`
- UI primitives: `src/components/ui/*`
- Animation wrapper’ları: `src/components/animations/*`
- Tek bir dosyada “her şey” biriktirme; her section ayrı bileşen olmalı.

## 6) Animasyon Kuralları (Sober)
- **Subtlety > spectacle**: kısa süreli, doğal hareket.
- Varsayılan: `spring` (yüksek stiffness, orta damping), az mesafe (`y ~ 6–12`), az scale (`0.98 → 1`).
- Scroll reveal: `Reveal`/`StaggerList` kullan:
  - `src/components/animations/Reveal.tsx`
- `prefers-reduced-motion` aktifse animasyonlar **kapatılmalı**.
- Hover interaksiyonları minimal (2px shift, hafif tint).

## 7) Global Atmosfer (Neon Palette – Low Opacity)
- Site arkaplan atmosferi: `src/components/animations/AmbientBackground.tsx`
- Opaklık düşük tutulur (yaklaşık `0.03–0.05`), blur yüksek, hareket yavaş.
- Kart okunabilirliğini bozacak kadar parlak/kontrastlı efektlerden kaçınılır.

## 8) Scroll / Navigation Davranışı
- Navbar anchor’ları: `NavAnchor` ile **garantili scroll**:
  - `src/components/linkedin/NavAnchor.tsx`
- Sticky header offset dikkate alınır.
- Active section hesaplaması scroll pozisyonuna göre yapılır:
  - `src/components/linkedin/useActiveSection.ts`

## 9) Logo / Görsel Yönetimi
- Statik dosyalar `public/` altındadır.
- Şirket logoları: `public/logos/*` + mapping:
  - `src/data/company-logos.ts`
- Eğitim logoları mapping:
  - `src/data/education-logos.ts`
- Award/hackathon logoları mapping:
  - `src/data/award-logos.ts`
- Logo yoksa fallback olarak baş harf gösterilir.

## 10) AI (Gemini) Kuralları
- API anahtarı **sadece server**’da: `GEMINI_API_KEY`
- Client’a asla env sızdırılmaz.
- Endpoint: `POST /api/ai` (stream output)
- Prompt kuralı: **Sadece CV verisine dayan**, CV’de yoksa “bilinmiyor” de.
- Follow-up: son ~5 exchange context gönderilir.

## 11) Güvenlik ve Gizlilik
- CV verisi server’da parse edilir; gerekiyorsa client’a sadece render için gerekli alanlar gönderilir.
- `GEMINI_API_KEY` repo’ya commit edilmez.
- `.env.local` kullan; örnekler için `.env.example` (sadece isimler).

## 12) Kod Stili / Convention
- `cn(...)` helper: `src/lib/utils.ts`
- Tailwind class’ları: önce layout → spacing → color → effect sıralaması tercih edilir.
- Türkçe UI metni / İngilizce UI metni sadece dictionary’den gelir.

## 13) Performans
- Büyük görseller `public/` altında optimize; mümkünse `next/image` kullan.
- Blur/ambient efektleri çok düşük opacity + tek katman; aşırı DOM/animation layer ekleme.
- Streaming AI UI’da state update’leri kontrollü (typing loop ile).

## 14) Geliştirme / Build
- Dev: `npm run dev`
- Build: `npm run build`
- Build temiz olmadan PR/merge yapılmaz.

