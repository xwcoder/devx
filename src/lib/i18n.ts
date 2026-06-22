import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { en } from "@/i18n/locales/en"
import { zh } from "@/i18n/locales/zh"

export const LOCALES = ["zh-CN", "en"] as const
export type Locale = (typeof LOCALES)[number]

export const LANGUAGE_STORAGE_KEY = "devx:locale"

export const resources = {
  "zh-CN": {
    translation: zh,
  },
  en: {
    translation: en,
  },
} as const

export function normalizeLocale(language: string | undefined): Locale {
  return language?.toLowerCase().startsWith("zh") ? "zh-CN" : "en"
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      caches: ["localStorage"],
      convertDetectedLanguage: normalizeLocale,
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      order: ["localStorage", "navigator"],
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources,
    supportedLngs: LOCALES,
  })

function syncDocumentLanguage(language: string) {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.lang = normalizeLocale(language)
}

syncDocumentLanguage(i18n.language)
i18n.on("languageChanged", syncDocumentLanguage)

export default i18n
