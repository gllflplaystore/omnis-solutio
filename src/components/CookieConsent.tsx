import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

const STORAGE_KEY = "cookie_consent";

type ConsentValue = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Delay a bit so the page has time to render first
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (value: ConsentValue) => {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ custom: true, ...preferences }),
    );
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "fixed z-50 w-120 max-w-[calc(100vw-2rem)]",
        "bottom-20 right-6",
        "rounded-2xl border border-(--color-stroke-soft-200)",
        "bg-(--color-bg-white-0) shadow-[0_8px_32px_rgba(0,0,0,0.14)]",
        "animate-in slide-in-from-bottom-4 duration-300",
      )}
    >
      {!showSettings ? (
        <div className="p-5">
          <p className="text-sm leading-relaxed text-(--color-text-sub-600)">
            Cookies help us to enhance your experience on our site, present ads
            that meet your needs, and improve our website.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => dismiss("accepted")}
              className={clsx(
                "h-9 rounded-xl px-4 text-sm font-semibold",
                "bg-(--color-primary-base) text-white",
                "transition-opacity hover:opacity-90",
              )}
            >
              Accept All
            </button>
            <button
              onClick={() => dismiss("rejected")}
              className={clsx(
                "h-9 rounded-xl border border-(--color-stroke-soft-200) px-4 text-sm font-semibold",
                "text-(--color-text-strong-950) transition-colors hover:bg-(--color-bg-weak-50)",
              )}
            >
              Reject All
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-sm font-medium text-(--color-text-sub-600) transition-colors hover:text-(--color-text-strong-950)"
            >
              Cookie settings
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--color-text-strong-950)">
              Cookie preferences
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-lg p-1 text-(--color-text-soft-400) transition-colors hover:text-(--color-text-strong-950)"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {(
              [
                {
                  key: "necessary",
                  label: "Necessary",
                  desc: "Required for the site to work",
                  locked: true,
                },
                {
                  key: "analytics",
                  label: "Analytics",
                  desc: "Help us improve our website",
                  locked: false,
                },
                {
                  key: "marketing",
                  label: "Marketing",
                  desc: "Personalised ads & content",
                  locked: false,
                },
              ] as const
            ).map(({ key, label, desc, locked }) => (
              <div key={key} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-(--color-text-strong-950)">
                    {label}
                  </p>
                  <p className="text-xs text-(--color-text-soft-400)">{desc}</p>
                </div>
                <button
                  disabled={locked}
                  onClick={() =>
                    !locked && setPreferences((p) => ({ ...p, [key]: !p[key] }))
                  }
                  className={clsx(
                    "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
                    preferences[key]
                      ? "bg-(--color-primary-base)"
                      : "bg-(--color-stroke-soft-200)",
                    locked && "cursor-not-allowed opacity-60",
                  )}
                  aria-checked={preferences[key]}
                  role="switch"
                >
                  <span
                    className={clsx(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      preferences[key] ? "left-4.5" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={savePreferences}
              className={clsx(
                "h-9 flex-1 rounded-xl px-4 text-sm font-semibold",
                "bg-(--color-primary-base) text-white transition-opacity hover:opacity-90",
              )}
            >
              Save preferences
            </button>
            <button
              onClick={() => dismiss("rejected")}
              className={clsx(
                "h-9 rounded-xl border border-(--color-stroke-soft-200) px-4 text-sm font-semibold",
                "text-(--color-text-strong-950) transition-colors hover:bg-(--color-bg-weak-50)",
              )}
            >
              Reject All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
