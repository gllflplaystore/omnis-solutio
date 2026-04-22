import { useEffect } from "react";
import i18n from "@/i18n";
import { toI18nKey } from "@/i18n/localeKey";
import { useAppSelector } from "@/hooks/useAppStore";

/**
 * Non-rendering component that keeps i18next in sync with the Redux locale state.
 * Fires on mount (to load the persisted locale on page load) and on every change.
 */
export default function I18nSync() {
  const { country, language } = useAppSelector((s) => s.locale);

  // Fire on mount — necessary so the persisted locale from localStorage
  // gets loaded even when it matches i18next's default 'global-en'
  useEffect(() => {
    i18n.changeLanguage(toI18nKey(country, language));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire on every locale change
  useEffect(() => {
    const key = toI18nKey(country, language);
    if (i18n.language !== key) {
      i18n.changeLanguage(key);
    }
  }, [country, language]);

  return null;
}
