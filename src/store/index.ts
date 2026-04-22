import { configureStore } from '@reduxjs/toolkit'
import localeReducer, { persistLocale } from './localeSlice'
import themeReducer, { persistTheme } from './themeSlice'

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    theme: themeReducer,
  },
})

// Persist locale and theme changes to localStorage
store.subscribe(() => {
  const state = store.getState()
  persistLocale(state.locale)
  persistTheme(state.theme.theme)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
