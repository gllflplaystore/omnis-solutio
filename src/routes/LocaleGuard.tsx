import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  isValidLocale,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  type CountryCode,
  type LanguageCode,
} from "@/constants/locales";
import { setLocale } from "@/store/localeSlice";
import { useAppDispatch } from "@/hooks/useAppStore";

interface LocaleGuardProps {
  children: React.ReactNode;
  /** When the country is baked into the route path (e.g. /ae/:lang), pass it explicitly. */
  country?: CountryCode;
}

/**
 * Validates locale against the locale constants.
 * Accepts an explicit `country` prop (from the registry) or falls back
 * to `:country` / `:lang` URL params for backwards-compat.
 * If invalid, redirects to /.
 * If valid, syncs into Redux state.
 */
export default function LocaleGuard({
  children,
  country: countryProp,
}: LocaleGuardProps) {
  const params = useParams<{ country: string; lang: string }>();
  const country =
    countryProp ?? (params.country as CountryCode) ?? DEFAULT_COUNTRY;
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const dispatch = useAppDispatch();

  const valid = isValidLocale(country, lang);

  useEffect(() => {
    if (valid) {
      dispatch(
        setLocale({
          country: country as CountryCode,
          language: lang as LanguageCode,
        }),
      );
    }
  }, [country, lang, valid, dispatch]);

  if (!valid) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
