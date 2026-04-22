export type CountryCode = 'ae' | 'gb' | 'global'
export type LanguageCode = 'ar' | 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'
export type Theme = 'light' | 'dark'

export interface LocaleOption {
  country: string
  countryCode: CountryCode
  languages: { label: string; code: LanguageCode }[]
  flag: string
}

export const LOCALES: LocaleOption[] = [
  {
    country: 'Global',
    countryCode: 'global',
    flag: '🌐',
    languages: [
      { label: 'English', code: 'en' },
      { label: 'Spanish', code: 'es' },
      { label: 'French', code: 'fr' },
      { label: 'German', code: 'de' },
      { label: 'Chinese', code: 'zh' },
      { label: 'Japanese', code: 'ja' },
    ],
  },
  {
    country: 'UAE',
    countryCode: 'ae',
    flag: '🇦🇪',
    languages: [
      { label: 'Arabic', code: 'ar' },
      { label: 'English', code: 'en' },
    ],
  },
  {
    country: 'United Kingdom',
    countryCode: 'gb',
    flag: '🇬🇧',
    languages: [{ label: 'English', code: 'en' }],
  },
]

export const RTL_LANGUAGES: LanguageCode[] = ['ar']

export const DEFAULT_COUNTRY: CountryCode = 'global'
export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export function isValidLocale(country: string, language: string): boolean {
  const locale = LOCALES.find((l) => l.countryCode === country)
  if (!locale) return false
  return locale.languages.some((l) => l.code === language)
}

export function getLocaleOption(countryCode: CountryCode): LocaleOption | undefined {
  return LOCALES.find((l) => l.countryCode === countryCode)
}

export function getDefaultLanguageForCountry(countryCode: CountryCode): LanguageCode {
  const locale = LOCALES.find((l) => l.countryCode === countryCode)
  return locale?.languages[0]?.code ?? DEFAULT_LANGUAGE
}

export function isRTL(languageCode: LanguageCode): boolean {
  return RTL_LANGUAGES.includes(languageCode)
}
