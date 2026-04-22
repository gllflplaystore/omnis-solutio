import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  type CountryCode,
  type LanguageCode,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  getDefaultLanguageForCountry,
  isValidLocale,
} from '@/constants/locales'

export interface LocaleState {
  country: CountryCode
  language: LanguageCode
}

const STORAGE_KEY = 'omnis:locale'

function loadFromStorage(): LocaleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LocaleState
    if (isValidLocale(parsed.country, parsed.language)) return parsed
  } catch {
    // ignore
  }
  return null
}

const persisted = loadFromStorage()

const initialState: LocaleState = persisted ?? {
  country: DEFAULT_COUNTRY,
  language: DEFAULT_LANGUAGE,
}

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<CountryCode>) {
      state.country = action.payload
      state.language = getDefaultLanguageForCountry(action.payload)
    },
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload
    },
    setLocale(state, action: PayloadAction<LocaleState>) {
      if (isValidLocale(action.payload.country, action.payload.language)) {
        state.country = action.payload.country
        state.language = action.payload.language
      }
    },
  },
})

export const { setCountry, setLanguage, setLocale } = localeSlice.actions
export default localeSlice.reducer

export function persistLocale(state: LocaleState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
