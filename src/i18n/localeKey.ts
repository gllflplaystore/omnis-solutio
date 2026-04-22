/**
 * Converts Redux's two-part locale state (country + language)
 * into a single i18next language key, and back.
 *
 * Examples:
 *   toI18nKey('ae', 'ar')  → 'ae-ar'
 *   toI18nKey('global', 'en') → 'global-en'
 *   fromI18nKey('ae-ar')   → { country: 'ae', language: 'ar' }
 */
export function toI18nKey(country: string, language: string): string {
  return `${country}-${language}`
}

export function fromI18nKey(key: string): { country: string; language: string } {
  const dashIndex = key.indexOf('-')
  if (dashIndex === -1) return { country: 'global', language: 'en' }
  return {
    country: key.slice(0, dashIndex),
    language: key.slice(dashIndex + 1),
  }
}
