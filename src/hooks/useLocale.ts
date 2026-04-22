import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useAppStore'
import { setLocale, setCountry, setLanguage } from '@/store/localeSlice'
import { isRTL, type CountryCode, type LanguageCode } from '@/constants/locales'

export function useLocale() {
  const dispatch = useAppDispatch()
  const { country, language } = useAppSelector((s) => s.locale)

  const changeLocale = useCallback(
    (newCountry: CountryCode, newLanguage: LanguageCode) => {
      dispatch(setLocale({ country: newCountry, language: newLanguage }))
    },
    [dispatch],
  )

  const changeCountry = useCallback(
    (newCountry: CountryCode) => {
      dispatch(setCountry(newCountry))
    },
    [dispatch],
  )

  const changeLanguage = useCallback(
    (newLanguage: LanguageCode) => {
      dispatch(setLanguage(newLanguage))
    },
    [dispatch],
  )

  return {
    country,
    language,
    isRTL: isRTL(language),
    changeLocale,
    changeCountry,
    changeLanguage,
  }
}
