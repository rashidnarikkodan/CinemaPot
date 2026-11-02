export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  gradient?: string;
}

export const POPULAR_LANGUAGES: LanguageOption[] = [
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    gradient: "from-amber-600/30 to-red-600/30",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    gradient: "from-orange-600/30 to-amber-600/30",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    gradient: "from-red-600/30 to-rose-600/30",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    gradient: "from-yellow-600/30 to-orange-600/30",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    gradient: "from-blue-600/30 to-cyan-600/30",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    gradient: "from-emerald-600/30 to-teal-600/30",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    gradient: "from-pink-600/30 to-purple-600/30",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    gradient: "from-rose-600/30 to-red-600/30",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    gradient: "from-yellow-600/30 to-red-600/30",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    gradient: "from-indigo-600/30 to-blue-600/30",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    gradient: "from-zinc-600/30 to-neutral-600/30",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    gradient: "from-emerald-600/30 to-green-600/30",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    gradient: "from-red-600/30 to-amber-600/30",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    gradient: "from-green-600/30 to-red-600/30",
  },
];

export const getLanguageByCode = (code?: string | null): LanguageOption | undefined => {
  if (!code) return undefined;
  return POPULAR_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
};

export const getLanguageName = (code?: string | null): string => {
  const match = getLanguageByCode(code);
  return match ? match.name : (code ? code.toUpperCase() : "All Languages");
};
