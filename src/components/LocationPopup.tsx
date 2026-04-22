import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { useParams, useNavigate } from "react-router-dom";
import {
  LOCALES,
  type CountryCode,
  getDefaultLanguageForCountry,
} from "@/constants/locales";

const STORAGE_KEY = "location_popup_dismissed";

/** Maps IANA timezone prefixes/exact IDs to a CountryCode. */
function detectCountryFromTimezone(): CountryCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith("Asia/Dubai") || tz === "Asia/Muscat") return "ae";
    if (tz.startsWith("Europe/London")) return "gb";
    return null; // stay on global
  } catch {
    return null;
  }
}

export default function LocationPopup() {
  const { country = "global" } = useParams<{
    country: string;
  }>();
  const navigate = useNavigate();
  // Compute once on mount — timezone doesn't change during a session
  const detectedCountry = useMemo(() => detectCountryFromTimezone(), []);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (!detectedCountry || detectedCountry === country) return;
    // Small delay so both popups don't animate simultaneously
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [country, detectedCountry]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleSwitch = () => {
    if (!detectedCountry) return;
    const defaultLang = getDefaultLanguageForCountry(detectedCountry);
    localStorage.setItem(STORAGE_KEY, "1");
    navigate(`/${detectedCountry}/${defaultLang}`);
  };

  if (!visible || !detectedCountry) return null;

  const detectedLocale = LOCALES.find((l) => l.countryCode === detectedCountry);
  const currentLocale = LOCALES.find((l) => l.countryCode === country);

  return (
    <div
      className={clsx(
        "fixed z-50 w-120 max-w-[calc(100vw-2rem)]",
        "bottom-56 right-6",
        "rounded-2xl border border-(--color-stroke-soft-200)",
        "bg-(--color-bg-white-0) shadow-[0_8px_32px_rgba(0,0,0,0.14)]",
        "animate-in slide-in-from-bottom-4 duration-300",
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-(--color-text-strong-950)">
            You're on the{" "}
            <span>
              {currentLocale?.flag} {currentLocale?.country ?? "Global"}
            </span>{" "}
            website
          </p>
          <button
            onClick={dismiss}
            className={clsx(
              "-mt-0.5 shrink-0 rounded-lg p-1",
              "text-(--color-text-soft-400) transition-colors hover:text-(--color-text-strong-950)",
            )}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <p className="mt-1.5 text-sm text-(--color-text-sub-600)">
          We offer content specific to your location:{" "}
          <span className="font-medium text-(--color-text-strong-950)">
            {detectedLocale?.flag} {detectedLocale?.country}
          </span>
        </p>

        {/* Action */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSwitch}
            className={clsx(
              "h-9 rounded-xl px-5 text-sm font-semibold",
              "bg-(--color-primary-base) text-white transition-opacity hover:opacity-90",
            )}
          >
            Switch
          </button>
          <button
            onClick={dismiss}
            className="text-sm font-medium text-(--color-text-sub-600) transition-colors hover:text-(--color-text-strong-950)"
          >
            Stay here
          </button>
        </div>
      </div>
    </div>
  );
}
