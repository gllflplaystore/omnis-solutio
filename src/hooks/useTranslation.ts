import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppSelector } from './useAppStore'

type LocaleModule = { default: Record<string, unknown> }

// Pre-register all locale files so Vite can code-split them correctly
const localeModules = import.meta.glob<LocaleModule>('../locales/**/*.json')

function resolveKey(key: string, translations: Record<string, unknown>): string {
  const parts = key.split('.')
  let current: unknown = translations
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key
    current = (current as Record<string, unknown>)[part]
  }
  if (typeof current === 'string') return current
  return key
}

async function loadLocale(country: string, language: string): Promise<Record<string, unknown>> {
  const path = `../locales/${country}/${language}.json`
  const loader = localeModules[path]
  if (loader) {
    const mod = await loader()
    return mod.default
  }
  // Fallback to global/en
  const fallback = localeModules['../locales/global/en.json']
  if (fallback) {
    const mod = await fallback()
    return mod.default
  }
  return {}
}

export function useTranslation() {
  const { country, language } = useAppSelector((s) => s.locale)
  const [translations, setTranslations] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const activeKey = useRef('')

  useEffect(() => {
    const key = `${country}/${language}`
    if (activeKey.current === key) return
    activeKey.current = key

    let cancelled = false
    loadLocale(country, language).then((data) => {
      if (!cancelled) {
        setTranslations(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [country, language])

  const t = useCallback(
    (key: string): string => {
      if (loading) return key
      return resolveKey(key, translations)
    },
    [translations, loading],
  )

  return { t, loading }
}

// Export item-level translation for arrays (e.g. features.items)
export function useTranslationArray() {
  const { t, loading } = useTranslation()
  const { country, language } = useAppSelector((s) => s.locale)
  const [translations, setTranslations] = useState<Record<string, unknown>>({})
  const activeKey = useRef('')

  useEffect(() => {
    const key = `${country}/${language}`
    if (activeKey.current === key) return
    activeKey.current = key

    let cancelled = false
    loadLocale(country, language).then((data) => {
      if (!cancelled) setTranslations(data)
    })
    return () => {
      cancelled = true
    }
  }, [country, language])

  function tArray<T>(key: string): T[] {
    const parts = key.split('.')
    let current: unknown = translations
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return []
      current = (current as Record<string, unknown>)[part]
    }
    if (Array.isArray(current)) return current as T[]
    return []
  }

  return { t, tArray, loading }
}
