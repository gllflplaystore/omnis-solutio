import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Theme } from "@/constants/locales";

export interface ThemeState {
  theme: Theme;
}

const STORAGE_KEY = "omnis:theme";

function loadTheme(): Theme {
  // Light theme is temporarily disabled — always use dark
  return "dark";
}

const initialState: ThemeState = {
  theme: loadTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(_state) {
      // Light theme is temporarily disabled — no-op
    },
    setTheme(state, action: PayloadAction<Theme>) {
      // Light theme is temporarily disabled — ignore 'light'
      if (action.payload === "dark") state.theme = "dark";
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}
