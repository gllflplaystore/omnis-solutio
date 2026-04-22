import { useTranslation as useI18nextTranslation } from 'react-i18next'

/**
 * Drop-in replacement for the custom useTranslation + useTranslationArray hooks.
 * Returns the same API shape — { t, tArray, loading } — powered by i18next.
 *
 * Usage (identical to the custom hook):
 *   const { t, tArray, loading } = useTranslationI18n()
 *   t('hero.headline')
 *   tArray<FeatureItem>('features.items')
 */
export function useTranslationI18n() {
  const { t: rawT, ready } = useI18nextTranslation()

  function t(key: string): string {
    return rawT(key)
  }

  function tArray<T>(key: string): T[] {
    const result = rawT(key, { returnObjects: true })
    if (Array.isArray(result)) return result as T[]
    return []
  }

  return { t, tArray, loading: !ready }
}
