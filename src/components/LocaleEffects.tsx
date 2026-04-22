import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppStore";
import { isRTL } from "@/constants/locales";

/**
 * Non-rendering component that synchronises Redux state
 * to the <html> element (dir, class) as side effects.
 */
export default function LocaleEffects() {
  const language = useAppSelector((s) => s.locale.language);
  const theme = useAppSelector((s) => s.theme.theme);

  // Sync RTL direction
  useEffect(() => {
    document.documentElement.dir = isRTL(language) ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Sync dark mode class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return null;
}
