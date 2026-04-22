import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import {
  LOCALES,
  type CountryCode,
  type LanguageCode,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
} from "@/constants/locales";
import { useLocale } from "@/hooks/useLocale";
import { FLAG_SRCS } from "@/constants/flags";

export default function LocaleSwitcher() {
  const navigate = useNavigate();
  const { country, language, changeLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelect(newCountry: CountryCode, newLang: LanguageCode) {
    changeLocale(newCountry, newLang);
    if (newCountry === DEFAULT_COUNTRY && newLang === DEFAULT_LANGUAGE) {
      navigate("/");
    } else {
      navigate(`/${newCountry}/${newLang}`);
    }
    setIsOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          "flex items-center gap-1.5 rounded-lg border border-(--color-stroke-soft-200)",
          "bg-(--color-bg-white-0) px-2.5 py-1.5",
          "transition-colors hover:bg-(--color-bg-weak-50) focus:outline-none",
        )}
        aria-label="Select locale"
        aria-expanded={isOpen}
      >
        <img
          src={FLAG_SRCS[country]}
          alt=""
          className="h-4 w-5 rounded-xs object-cover"
        />
        <ChevronDown
          size={13}
          className={clsx(
            "text-(--color-text-sub-600) transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className={clsx(
            "absolute right-0 top-full mt-2 z-50 w-72",
            "rounded-xl border border-(--color-stroke-soft-200)",
            "bg-(--color-bg-white-0) shadow-(--shadow-regular-md)",
            "p-4",
          )}
        >
          {LOCALES.map((locale, i) => (
            <div
              key={locale.countryCode}
              className={clsx(
                i > 0 && "mt-3 pt-3 border-t border-(--color-stroke-soft-200)",
              )}
            >
              {/* Country header */}
              <div className="flex items-center gap-2 mb-2.5">
                <img
                  src={FLAG_SRCS[locale.countryCode]}
                  alt=""
                  className="h-4 w-5 rounded-xs object-cover"
                />
                <span className="text-sm font-semibold text-(--color-text-strong-950)">
                  {locale.country}
                </span>
              </div>

              {/* Language pills */}
              <div className="flex flex-wrap gap-1.5">
                {locale.languages.map((lang) => {
                  const isActive =
                    locale.countryCode === country && lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleSelect(
                          locale.countryCode as CountryCode,
                          lang.code,
                        )
                      }
                      className={clsx(
                        "rounded-full px-3 py-0.5 text-sm transition-colors",
                        isActive
                          ? "bg-(--color-primary-base) text-white font-medium"
                          : "text-(--color-text-sub-600) hover:text-(--color-text-strong-950) hover:bg-(--color-bg-weak-50)",
                      )}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
