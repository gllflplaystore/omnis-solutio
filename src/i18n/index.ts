import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { fromI18nKey } from './localeKey'

/**
 * All valid i18next language keys, mapping to the existing locale JSON files.
 * Format: '{countryCode}-{languageCode}'
 */
const SUPPORTED_LANGUAGES = [
  'global-en',
  'global-es',
  'global-fr',
  'global-de',
  'global-zh',
  'global-ja',
  'ae-en',
  'ae-ar',
  'gb-en',
] as const

export type I18nLanguageKey = (typeof SUPPORTED_LANGUAGES)[number]

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend(async (language: string) => {
      // language is e.g. 'ae-ar' — split back to country/language to match file paths
      const { country, lang } = (() => {
        const { country, language: lang } = fromI18nKey(language)
        return { country, lang }
      })()

      // Falls back to global/en for any unrecognised key
      try {
        const mod = await import(`../locales/${country}/${lang}.json`)
        return mod.default
      } catch {
        const fallback = await import('../locales/global/en.json')
        return fallback.default
      }
    }),
  )
  .init({
    lng: 'global-en',
    fallbackLng: 'global-en',
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false, // We handle loading state manually via `ready`
    },
  })

export default i18n
