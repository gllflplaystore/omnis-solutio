import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { clsx } from "clsx";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { toggleTheme } from "@/store/themeSlice";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-lg",
        "border border-(--color-stroke-soft-200) bg-(--color-bg-white-0)",
        "text-(--color-text-sub-600) transition-colors",
        "hover:bg-(--color-bg-weak-50) hover:text-(--color-text-strong-950)",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-base)",
      )}
    >
      {isDark ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
    </button>
  );
}
