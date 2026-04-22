import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import companyLogoDark from "@/assets/Brand Items [Atomic].svg";
import companyLogoLight from "@/assets/Omnis_Solutio_Logo_Black_Text.svg";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/hooks/useAppStore";
import { useLocale } from "@/hooks/useLocale";
import {
  LOCALES,
  type CountryCode,
  type LanguageCode,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isRTL,
} from "@/constants/locales";
import { FLAG_SRCS } from "@/constants/flags";
import Container from "./ui/Container";
// import ThemeToggle from "./ThemeToggle";

type MenuId = "locale" | "products" | "solutions" | "resources";

const navItemClass = clsx(
  "flex items-center gap-1 text-sm font-medium text-white leading-5 tracking-[-0.084px]",
  "transition-colors hover:text-(--color-text-strong-950)",
);

const megaMenuClass = clsx(
  "absolute left-0 top-full w-full z-50",
  "border-t border-(--color-stroke-soft-200)",
  "bg-(--color-bg-white-0)/92 backdrop-blur-2xl",
  "ring-1 ring-black/5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]",
);

export default function Navbar() {
  const { t } = useTranslation();
  const theme = useAppSelector((s) => s.theme.theme);
  const companyLogo = theme === "dark" ? companyLogoDark : companyLogoLight;

  const navigate = useNavigate();
  const {
    country: currentCountry,
    language: currentLanguage,
    changeLocale,
  } = useLocale();

  // Derive base path and UAE flag from Redux store (synced by LocaleGuard)
  const country = currentCountry;
  const lang = currentLanguage;
  const rtl = isRTL(currentLanguage);
  const base =
    country === DEFAULT_COUNTRY && lang === DEFAULT_LANGUAGE
      ? "/"
      : `/${country}/${lang}`;

  // Single discriminated state replaces 4 separate boolean dropdowns.
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [closingMenu, setClosingMenu] = useState<MenuId | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [drawerRendered, setDrawerRendered] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Single ref on the header covers all mega-menu panels.
  const headerRef = useRef<HTMLElement>(null);

  function toggleMenu(id: MenuId) {
    if (openMenu === id) {
      setClosingMenu(id);
      setOpenMenu(null);
    } else {
      setClosingMenu(null);
      setOpenMenu(id);
    }
  }

  // Clear closing menu after exit animation completes (280ms)
  useEffect(() => {
    if (closingMenu) {
      const timer = setTimeout(() => {
        setClosingMenu(null);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [closingMenu]);

  const handleLocaleSelect = useCallback(
    (newCountry: CountryCode, newLang: LanguageCode) => {
      changeLocale(newCountry, newLang);
      if (newCountry === DEFAULT_COUNTRY && newLang === DEFAULT_LANGUAGE) {
        navigate("/");
      } else {
        navigate(`/${newCountry}/${newLang}`);
      }
      setClosingMenu("locale");
      setOpenMenu(null);
    },
    [changeLocale, navigate],
  );

  // Unified click-outside + Escape handler.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        if (openMenu) {
          setClosingMenu(openMenu);
        }
        setOpenMenu(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (openMenu) {
          setClosingMenu(openMenu);
        }
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  // Toggle body classes: blur page content + lock scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMobileOpen);

    document.body.classList.toggle("overflow-hidden", isMobileOpen);
    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileOpen]);

  // Reset mobile-menu and mega-menu state when the viewport crosses the lg
  // breakpoint (1024 px). Without this the mobile drawer stays "open" after a
  // resize/device-switch, requiring a manual page refresh.
  useEffect(() => {
    const LG_BREAKPOINT = 1024;
    function handleResize() {
      if (window.innerWidth >= LG_BREAKPOINT) {
        setIsMobileOpen(false);
        setOpenMenu(null);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Two-phase drawer mount:
  // Phase 1: mount the DOM (off-screen) → Phase 2: trigger CSS transition on next frame.
  // On close: remove visible class first, then unmount after animation completes.
  useEffect(() => {
    if (isMobileOpen) {
      setDrawerRendered(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setDrawerVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setDrawerVisible(false);
      const timer = setTimeout(() => setDrawerRendered(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isMobileOpen]);

  // Mark component as mounted to prevent SSR/hydration flicker.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close any open mega-menu when the mobile drawer is opened.
  useEffect(() => {
    if (isMobileOpen) {
      setOpenMenu(null);
    }
  }, [isMobileOpen]);

  // Scroll-based shadow effect: softer at top, stronger when scrolled.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLocaleOpen = openMenu === "locale" || closingMenu === "locale";

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const href = e.currentTarget.getAttribute("href") ?? "";
    const hash = href.includes("#") ? href.split("#")[1] : null;
    // No hash → plain route navigation, let React Router handle it.
    if (!hash) return;
    const el = document.getElementById(hash);
    // Element not on this page → let React Router navigate; LandingPage will scroll on mount.
    if (!el) return;
    e.preventDefault();
    const navHeight = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const contactHref = `${base === "/" ? "" : base}/contact`;
  const pricingHref = `${base === "/" ? "" : base}/pricing`;
  const isUAE = country === "ae";

  // ── UAE mega-menu data ──────────────────────────────────────────────────
  const uaeProductsMenu = {
    business: {
      label: t("nav.products_menu.business_label"),
      items: [
        {
          title: t("nav.products_menu.domestic_title"),
          desc: t("nav.products_menu.domestic_desc"),
          href: `${base}/products/domestic-account`,
        },
        {
          title: t("nav.products_menu.multicurrency_title"),
          desc: t("nav.products_menu.multicurrency_desc"),
          href: `${base}/products/multi-currency`,
        },
      ],
    },
    individual: {
      label: t("nav.products_menu.individual_label"),
      items: [
        {
          title: t("nav.products_menu.wallet_title"),
          desc: t("nav.products_menu.wallet_desc"),
          href: `${base}#products`,
        },
      ],
    },
    promo: {
      title: t("nav.products_menu.promo_title"),
      desc: t("nav.products_menu.promo_desc"),
      cta: t("nav.products_menu.promo_cta"),
      href: `${base}#products`,
    },
  };

  const uaeSolutionsMenu = {
    business: {
      label: t("nav.solutions_menu.business_label"),
      items: [
        {
          title: t("nav.solutions_menu.open_banking_title"),
          desc: t("nav.solutions_menu.open_banking_desc"),
          href: `${base}/solutions`,
        },
        {
          title: t("nav.solutions_menu.bulk_payments_title"),
          desc: t("nav.solutions_menu.bulk_payments_desc"),
          href: `${base}/solutions`,
        },
        {
          title: t("nav.solutions_menu.vault_title"),
          desc: t("nav.solutions_menu.vault_desc"),
          href: `${base}/solutions`,
        },
        {
          title: t("nav.solutions_menu.cross_border_title"),
          desc: t("nav.solutions_menu.cross_border_desc"),
          href: `${base}/solutions`,
        },
        {
          title: t("nav.solutions_menu.payouts_title"),
          desc: t("nav.solutions_menu.payouts_desc"),
          href: `${base}/solutions`,
        },
      ],
    },
    individual: {
      label: t("nav.solutions_menu.individual_label"),
      items: [
        {
          title: t("nav.solutions_menu.ind_domestic_title"),
          desc: t("nav.solutions_menu.ind_domestic_desc"),
          href: `${base}/solutions`,
        },
      ],
    },
    promo: {
      title: t("nav.solutions_menu.promo_title"),
      desc: t("nav.solutions_menu.promo_desc"),
      cta: t("nav.solutions_menu.promo_cta"),
      href: contactHref,
    },
  };

  const uaeResourcesMenu = {
    docs: {
      label: t("nav.resources_menu.docs_label"),
      items: [
        {
          title: t("nav.resources_menu.guides_title"),
          desc: t("nav.resources_menu.guides_desc"),
          href: `${base}#faq`,
        },
        {
          title: t("nav.resources_menu.api_title"),
          desc: t("nav.resources_menu.api_desc"),
          href: `${base}#faq`,
        },
        {
          title: t("nav.resources_menu.help_title"),
          desc: t("nav.resources_menu.help_desc"),
          href: `${base}#faq`,
        },
      ],
    },
    company: {
      label: t("nav.resources_menu.company_label"),
      items: [
        {
          title: t("nav.resources_menu.about_title"),
          desc: t("nav.resources_menu.about_desc"),
          href: `${base}#faq`,
        },
        {
          title: t("nav.resources_menu.blog_title"),
          desc: t("nav.resources_menu.blog_desc"),
          href: `${base}#faq`,
        },
      ],
    },
  };
  // ───────────────────────────────────────────────────────────────────────

  const navLinks = [
    { label: t("nav.products"), href: `${base}#products` },
    // { label: t("nav.solutions"), href: `${base}/products/domestic-account` },
    { label: t("nav.solutions"), href: `${base}#solutions` },
    { label: t("nav.pricing"), href: pricingHref },
    { label: t("nav.resources"), href: `${base}#faq` },
    { label: t("nav.contact"), href: contactHref },
  ];

  if (!mounted) return null;

  return (
    <header
      ref={headerRef}
      className={clsx(
        "sticky top-0 z-40 w-full border-b border-(--color-stroke-soft-200)/80 bg-(--color-bg-white-0)/78 backdrop-blur-xl",
        "transition-shadow duration-300 ease-out",
        isScrolled
          ? "shadow-[0_12px_40px_rgba(0,0,0,0.11)]"
          : "shadow-[0_8px_28px_rgba(0,0,0,0.06)]",
      )}
    >
      {/* <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"> */}
      <Container
        variant="fluid"
        className="flex flex-col md:flex-row gap-4 py-4 items-center justify-between h-auto md:h-19"
      >
        <div className="flex">
          {/* Logo */}
          <Link to={base} className="flex items-center gap-2 shrink-0">
            <img src={companyLogo} alt="Omnis Solutio" className="h-8" />
          </Link>

          {/* Desktop Nav */}
          {isUAE ? (
            <nav
              className="hidden items-center gap-1 lg:flex ms-10"
              aria-label="Main navigation"
            >
              {/* Products */}
              <button
                onClick={() => toggleMenu("products")}
                aria-expanded={openMenu === "products"}
                className={clsx(
                  navItemClass,
                  "rounded-lg px-3 py-2 gap-1",
                  openMenu === "products" && "text-(--color-text-strong-950)",
                )}
              >
                {t("nav.products")}
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-transform pointer-events-none",
                    openMenu === "products" && "rotate-180",
                  )}
                />
              </button>

              {/* Solutions */}
              <button
                onClick={() => toggleMenu("solutions")}
                aria-expanded={openMenu === "solutions"}
                className={clsx(
                  navItemClass,
                  "rounded-lg px-3 py-2 gap-1",
                  openMenu === "solutions" && "text-(--color-text-strong-950)",
                )}
              >
                {t("nav.solutions")}
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-transform pointer-events-none",
                    openMenu === "solutions" && "rotate-180",
                  )}
                />
              </button>

              {/* Pricing — plain link */}
              <Link
                to={`${base}#pricing`}
                onClick={handleNavClick}
                className={clsx(navItemClass, "rounded-lg px-3 py-2")}
              >
                {t("nav.pricing")}
              </Link>

              {/* Resources */}
              <button
                onClick={() => toggleMenu("resources")}
                aria-expanded={openMenu === "resources"}
                className={clsx(
                  navItemClass,
                  "rounded-lg px-3 py-2 gap-1",
                  openMenu === "resources" && "text-(--color-text-strong-950)",
                )}
              >
                {t("nav.resources")}
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-transform pointer-events-none",
                    openMenu === "resources" && "rotate-180",
                  )}
                />
              </button>

              {/* Contact — plain link */}
              <Link
                to={contactHref}
                onClick={handleNavClick}
                className={clsx(navItemClass, "rounded-lg px-3 py-2")}
              >
                {t("nav.contact")}
              </Link>
            </nav>
          ) : (
            <nav
              className="hidden items-center gap-1 lg:flex ms-10"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleNavClick}
                  className={clsx(navItemClass, "rounded-lg px-3 py-2")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        {/* Controls */}
        <div className="flex items-center gap-3 w-full justify-between md:justify-end">
          {/* Desktop locale trigger */}
          <div className="hidden lg:block">
            <button
              onClick={() => toggleMenu("locale")}
              aria-label="Select locale"
              aria-expanded={isLocaleOpen}
              aria-controls="locale-menu"
              className={clsx(
                "flex items-center gap-1.5 rounded-lg border border-(--color-stroke-soft-200)",
                "bg-(--color-bg-white-0) px-2.5 py-1.5",
                "transition-colors hover:bg-bg-weak-50 focus:outline-none",
              )}
            >
              <img
                src={FLAG_SRCS[currentCountry]}
                alt=""
                className="h-4 w-5 rounded-xs object-cover"
              />
            </button>

            {isLocaleOpen && (
              <div
                id="locale-menu"
                role="region"
                aria-label="Language and region"
                className={clsx(
                  megaMenuClass,
                  closingMenu === "locale"
                    ? "mega-menu-exit"
                    : "mega-menu-enter",
                )}
              >
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                  {/* Global — full row */}
                  {LOCALES.slice(0, 1).map((locale) => (
                    <div
                      key={locale.countryCode}
                      className="flex items-center gap-8"
                    >
                      <div className="flex items-center gap-2 w-36 shrink-0">
                        <img
                          src={FLAG_SRCS[locale.countryCode]}
                          alt=""
                          className="h-4 w-5 rounded-xs object-cover"
                        />
                        <span className="text-sm font-semibold text-(--color-text-strong-950)">
                          {locale.country}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {locale.languages.map((langOpt) => {
                          const isActive =
                            locale.countryCode === currentCountry &&
                            langOpt.code === currentLanguage;
                          return (
                            <button
                              key={langOpt.code}
                              onClick={() =>
                                handleLocaleSelect(
                                  locale.countryCode,
                                  langOpt.code,
                                )
                              }
                              className={clsx(
                                "rounded-full px-3 py-0.5 text-sm transition-colors",
                                isActive
                                  ? "bg-(--color-primary-base) text-white font-medium"
                                  : "text-(--color-text-sub-600) hover:text-(--color-text-strong-950) hover:bg-bg-weak-50",
                              )}
                            >
                              {langOpt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* UAE + UK — two columns */}
                  <div className="mt-5 pt-5 border-t border-(--color-stroke-soft-200) grid grid-cols-2 gap-10">
                    {LOCALES.slice(1).map((locale) => (
                      <div
                        key={locale.countryCode}
                        className="flex items-center gap-8"
                      >
                        <div className="flex items-center gap-2 w-36 shrink-0">
                          <img
                            src={FLAG_SRCS[locale.countryCode]}
                            alt=""
                            className="h-4 w-5 rounded-xs object-cover"
                          />
                          <span className="text-sm font-semibold text-(--color-text-strong-950)">
                            {locale.country}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {locale.languages.map((langOpt) => {
                            const isActive =
                              locale.countryCode === currentCountry &&
                              langOpt.code === currentLanguage;
                            return (
                              <button
                                key={langOpt.code}
                                onClick={() =>
                                  handleLocaleSelect(
                                    locale.countryCode,
                                    langOpt.code,
                                  )
                                }
                                className={clsx(
                                  "rounded-full px-3 py-0.5 text-sm transition-colors",
                                  isActive
                                    ? "bg-(--color-primary-base) text-white font-medium"
                                    : "text-(--color-text-sub-600) hover:text-(--color-text-strong-950) hover:bg-bg-weak-50",
                                )}
                              >
                                {langOpt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link
            to={contactHref}
            className="flex items-center gap-1 rounded-10 px-3 py-2 text-sm leading-5 font-medium text-white bg-(--color-primary-base) hover:opacity-90 transition-opacity shrink-0 w-auto sm:px-4 sm:py-2.5 sm:text-base"
          >
            {t("hero.cta_primary")}
            <ArrowUpRight size={15} className="shrink-0" />
          </Link>
          {/* <ThemeToggle /> */}
          {/* Mobile hamburger — always shows Menu icon; the drawer has its own X close button */}
          <button
            className="flex items-center justify-center rounded-lg p-2 text-(--color-text-sub-600) transition-colors hover:bg-bg-weak-50 lg:hidden"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <Menu size={20} />
          </button>
        </div>
        {/* </div> */}
      </Container>

      {/* UAE Products mega-menu */}
      {isUAE && (openMenu === "products" || closingMenu === "products") && (
        <div
          id="products-menu"
          role="region"
          aria-label="Products menu"
          className={clsx(
            megaMenuClass,
            closingMenu === "products" ? "mega-menu-exit" : "mega-menu-enter",
          )}
        >
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-10">
              {/* For Business */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeProductsMenu.business.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeProductsMenu.business.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* For Individual */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeProductsMenu.individual.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeProductsMenu.individual.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo card */}
              <div className="rounded-xl bg-bg-weak-50 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--color-text-strong-950)">
                    {uaeProductsMenu.promo.title}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-sub-600)">
                    {uaeProductsMenu.promo.desc}
                  </p>
                </div>
                <Link
                  to={uaeProductsMenu.promo.href}
                  onClick={(e) => {
                    handleNavClick(e);
                    setOpenMenu(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--color-primary-base) hover:opacity-80"
                >
                  {uaeProductsMenu.promo.cta}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UAE Solutions mega-menu */}
      {isUAE && (openMenu === "solutions" || closingMenu === "solutions") && (
        <div
          id="solutions-menu"
          role="region"
          aria-label="Solutions menu"
          className={clsx(
            megaMenuClass,
            closingMenu === "solutions" ? "mega-menu-exit" : "mega-menu-enter",
          )}
        >
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-10">
              {/* For Business */}
              <div className="col-span-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeSolutionsMenu.business.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeSolutionsMenu.business.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* For Individual */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeSolutionsMenu.individual.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeSolutionsMenu.individual.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo card */}
              <div className="rounded-xl bg-bg-weak-50 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--color-text-strong-950)">
                    {uaeSolutionsMenu.promo.title}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-sub-600)">
                    {uaeSolutionsMenu.promo.desc}
                  </p>
                </div>
                <Link
                  to={uaeSolutionsMenu.promo.href}
                  onClick={(e) => {
                    handleNavClick(e);
                    setOpenMenu(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--color-primary-base) hover:opacity-80"
                >
                  {uaeSolutionsMenu.promo.cta}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UAE Resources mega-menu */}
      {isUAE && (openMenu === "resources" || closingMenu === "resources") && (
        <div
          id="resources-menu"
          role="region"
          aria-label="Resources menu"
          className={clsx(
            megaMenuClass,
            closingMenu === "resources" ? "mega-menu-exit" : "mega-menu-enter",
          )}
        >
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <div className="grid grid-cols-2 gap-10">
              {/* Documentation */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeResourcesMenu.docs.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeResourcesMenu.docs.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                  {uaeResourcesMenu.company.label}
                </p>
                <div className="flex flex-col gap-1">
                  {uaeResourcesMenu.company.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setOpenMenu(null);
                      }}
                      className="group rounded-lg p-2.5 transition-colors hover:bg-bg-weak-50"
                    >
                      <p className="text-sm font-medium text-(--color-text-strong-950) group-hover:text-(--color-primary-base)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-text-sub-600)">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer — slides in from the right */}
      {drawerRendered && (
        <>
          {/* Backdrop */}
          <div
            className={clsx(
              "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-400",
              drawerVisible
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className={clsx(
              "fixed top-0 z-50 h-dvh w-full max-w-full lg:hidden",
              rtl ? "left-0" : "right-0",
              "flex flex-col",
              rtl ? "drawer-panel-rtl" : "drawer-panel",
              "bg-(--color-bg-white-0)",
              "transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
              drawerVisible
                ? "translate-x-0 opacity-100"
                : rtl
                  ? "-translate-x-full opacity-95"
                  : "translate-x-full opacity-95",
            )}
          >
            {/* Subtle top accent line */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-(--color-primary-base) to-transparent" />

            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-(--color-stroke-soft-200) px-5 py-4">
              <Link to={base} onClick={() => setIsMobileOpen(false)}>
                <img src={companyLogo} alt="Omnis Solutio" className="h-7" />
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center rounded-lg p-1.5 text-(--color-text-sub-600) transition-all duration-200 hover:bg-bg-weak-50 hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-1 text-sm text-(--color-text-sub-600)">
                {isUAE ? (
                  <>
                    {/* Products expandable */}
                    <button
                      onClick={() =>
                        setOpenMenu((p) =>
                          p === "products" ? null : "products",
                        )
                      }
                      className="drawer-item flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      <span className="font-medium">{t("nav.products")}</span>
                      <ChevronDown
                        size={14}
                        className={clsx(
                          "transition-transform duration-300 pointer-events-none",
                          openMenu === "products" && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "drawer-accordion",
                        openMenu === "products" && "open",
                      )}
                    >
                      <div>
                        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-(--color-primary-base)/20 pl-3">
                          <p className="drawer-sub-item mt-1 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeProductsMenu.business.label}
                          </p>
                          {uaeProductsMenu.business.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                          <p className="drawer-sub-item mt-2 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeProductsMenu.individual.label}
                          </p>
                          {uaeProductsMenu.individual.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Solutions expandable */}
                    <button
                      onClick={() =>
                        setOpenMenu((p) =>
                          p === "solutions" ? null : "solutions",
                        )
                      }
                      className="drawer-item flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      <span className="font-medium">{t("nav.solutions")}</span>
                      <ChevronDown
                        size={14}
                        className={clsx(
                          "transition-transform duration-300 pointer-events-none",
                          openMenu === "solutions" && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "drawer-accordion",
                        openMenu === "solutions" && "open",
                      )}
                    >
                      <div>
                        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-(--color-primary-base)/20 pl-3">
                          <p className="drawer-sub-item mt-1 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeSolutionsMenu.business.label}
                          </p>
                          {uaeSolutionsMenu.business.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                          <p className="drawer-sub-item mt-2 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeSolutionsMenu.individual.label}
                          </p>
                          {uaeSolutionsMenu.individual.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing — plain */}
                    <Link
                      to={`${base}#pricing`}
                      onClick={(e) => {
                        handleNavClick(e);
                        setIsMobileOpen(false);
                      }}
                      className="drawer-item rounded-lg px-3 py-2.5 font-medium transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      {t("nav.pricing")}
                    </Link>

                    {/* Resources expandable */}
                    <button
                      onClick={() =>
                        setOpenMenu((p) =>
                          p === "resources" ? null : "resources",
                        )
                      }
                      className="drawer-item flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      <span className="font-medium">{t("nav.resources")}</span>
                      <ChevronDown
                        size={14}
                        className={clsx(
                          "transition-transform duration-300 pointer-events-none",
                          openMenu === "resources" && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "drawer-accordion",
                        openMenu === "resources" && "open",
                      )}
                    >
                      <div>
                        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-(--color-primary-base)/20 pl-3">
                          <p className="drawer-sub-item mt-1 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeResourcesMenu.docs.label}
                          </p>
                          {uaeResourcesMenu.docs.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                          <p className="drawer-sub-item mt-2 mb-0.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-disabled-300)">
                            {uaeResourcesMenu.company.label}
                          </p>
                          {uaeResourcesMenu.company.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={(e) => {
                                handleNavClick(e);
                                setIsMobileOpen(false);
                                setOpenMenu(null);
                              }}
                              className="drawer-sub-item rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950) hover:translate-x-0.5"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact — plain */}
                    <Link
                      to={contactHref}
                      onClick={() => setIsMobileOpen(false)}
                      className="drawer-item rounded-lg px-3 py-2.5 font-medium transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      {t("nav.contact")}
                    </Link>
                  </>
                ) : (
                  navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={(e) => {
                        handleNavClick(e);
                        setIsMobileOpen(false);
                      }}
                      className="drawer-item rounded-lg px-3 py-2.5 font-medium transition-colors duration-200 hover:bg-bg-weak-50 hover:text-(--color-text-strong-950)"
                    >
                      {link.label}
                    </Link>
                  ))
                )}

                {/* Locale switcher */}
                <div className="drawer-item mt-3 pt-3 border-t border-(--color-stroke-soft-200)">
                  <LocaleSwitcher />
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-(--color-primary-base)/50 to-transparent" />
          </div>
        </>
      )}
    </header>
  );
}
