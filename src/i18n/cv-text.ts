import type { Locale } from "@/src/i18n/locales";

/**
 * CV içeriği LaTeX'te İngilizce olduğu için, /tr görünümünde UI daha doğal olsun diye
 * birebir metin eşlemesiyle TR çevirisi uyguluyoruz.
 *
 * Not: Bu bir "çeviri katmanı"; kaynak veri yine `cv.latex`.
 */
const CV_TR: Record<string, string> = {
  // Profile / About
  "Full-stack Software Engineer & Mathematical Engineer":
    "Full-stack Yazılım Mühendisi & Matematik Mühendisi",
  "Full-stack Software Engineer & Mathematical Engineer with a strong focus on Web3 ecosystems, Autonomous AI Agents, and Backend Scalability. Proven track record in developing complex microservices using NestJS, gRPC, and Ethers.js.":
    "Web3 ekosistemleri, otonom yapay zekâ ajanları ve backend ölçeklenebilirliğine güçlü odaklanan Full‑stack Yazılım Mühendisi & Matematik Mühendisi. NestJS, gRPC ve Ethers.js kullanarak karmaşık mikroservisler geliştirme konusunda kanıtlanmış tecrübe.",

  // Experience titles
  "Partner | Senior Developer": "Partner | Kıdemli Geliştirici",
  "Fullstack Developer": "Full‑stack Geliştirici",
  "Software Developer": "Yazılım Geliştirici",
  "Frontend Educator & Mentor": "Frontend Eğitmeni & Mentor",

  // Experience bullets
  "Architected a high-performance microservices backend using gRPC for low-latency communication between AI agent services.":
    "AI ajan servisleri arasında düşük gecikmeli iletişim için gRPC kullanarak yüksek performanslı bir mikroservis backend mimarisi tasarladım.",
  "Developed SAM, an autonomous AI agent workflow tool, using NestJS and React Flow, enabling automated Web3 transaction management.":
    "NestJS ve React Flow kullanarak, otomatik Web3 işlem yönetimini mümkün kılan otonom AI ajan iş akışı aracı SAM’i geliştirdim.",
  "Implemented robust task queuing systems with Redis and BullMQ to handle 200+ concurrent users in closed alpha.":
    "Kapalı alfa sürecinde 200+ eşzamanlı kullanıcıyı yönetmek için Redis ve BullMQ ile sağlam görev kuyruklama sistemleri uyguladım.",
  "Engineered an automated token creation and management ecosystem on Ethereum using NestJS and Java Quarkus.":
    "NestJS ve Java Quarkus kullanarak Ethereum üzerinde otomatik token oluşturma ve yönetim ekosistemi geliştirdim.",
  "Integrated OpenAI API to generate unique personas and social media content for autonomous on-chain agents.":
    "Otonom on‑chain ajanlar için benzersiz persona ve sosyal medya içerikleri üretmek amacıyla OpenAI API entegrasyonu yaptım.",
  "Authored secure Smart Contracts for token distribution and automated claim processes.":
    "Token dağıtımı ve otomatik claim süreçleri için güvenli akıllı kontratlar yazdım.",
  "Managed maintenance and optimization for high-traffic mobile and web apps (Koroplast, Lassa, Akka Hotels).":
    "Yüksek trafikli mobil ve web uygulamalarında (Koroplast, Lassa, Akka Hotels) bakım ve optimizasyon süreçlerini yönettim.",
  "Resolved critical performance bottlenecks and UI bugs for the Tuttur application using React Native.":
    "React Native kullanarak Tuttur uygulamasındaki kritik performans darboğazlarını ve UI hatalarını giderdim.",
  "Developed Miscet, an NFT ticketing app, using React Native (Expo) and Next.js.":
    "React Native (Expo) ve Next.js kullanarak NFT biletleme uygulaması Miscet’i geliştirdim.",
  "Built the entire DevOps infrastructure from scratch using AWS, Docker, and Jenkins.":
    "AWS, Docker ve Jenkins kullanarak tüm DevOps altyapısını sıfırdan kurdum.",
  "Delivering advanced React Native courses and providing 1-on-1 technical mentorship to aspiring developers.":
    "İleri seviye React Native eğitimleri veriyor ve geliştirici adaylarına birebir teknik mentorluk sağlıyorum.",

  // Education
  "Istanbul Technical University": "İstanbul Teknik Üniversitesi",
  "B.Sc. in Mathematical Engineering": "Matematik Mühendisliği Lisans (B.Sc.)",

  // Awards details
  "Participant & Finisher": "Katılımcı & Tamamlayan",
  "Bounty Winner (1st Place)": "Bounty Kazananı (1.lik)",
  "Participant": "Katılımcı",
  "2nd Place Winner": "2.lik",
};

export function cvText(text: string, locale: Locale) {
  if (locale !== "tr") return text;
  return CV_TR[text] ?? text;
}

