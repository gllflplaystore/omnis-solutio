import globalFlag from "@/assets/earth-fill.svg";
import aeFlag from "@/assets/flags/United Arab Emirates.svg";
import gbFlag from "@/assets/flags/United Kingdom.svg";

/** Maps countryCode → flag SVG URL. Shared across Navbar and LocaleSwitcher. */
export const FLAG_SRCS: Record<string, string> = {
  global: globalFlag,
  ae: aeFlag,
  gb: gbFlag,
};
