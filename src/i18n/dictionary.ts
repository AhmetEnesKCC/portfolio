import type { Locale } from "@/src/i18n/locales";

const DICT = {
  tr: {
    brand: {
      profile: "Profil",
    },
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımda",
      skills: "Yetenekler",
      experience: "Deneyim",
      education: "Eğitim",
      awards: "Ödüller",
    },
    sections: {
      about: "Hakkımda",
      skills: "Teknik Yetenekler",
      experience: "Deneyim",
      education: "Eğitim",
      awards: "Hackathonlar & Ödüller",
    },
    meta: {
      title: "Ahmet Enes Keçeci",
      description:
        "Kişisel LinkedIn profil deneyimi — modern, koyu tema developer portföyü.",
    },
  },
  en: {
    brand: {
      profile: "Profile",
    },
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      awards: "Awards",
    },
    sections: {
      about: "About",
      skills: "Technical Skills",
      experience: "Experience",
      education: "Education",
      awards: "Hackathons & Awards",
    },
    meta: {
      title: "Ahmet Enes Keçeci",
      description:
        "Personal LinkedIn profile experience — high-end, dark-mode developer portfolio.",
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return DICT[locale];
}

