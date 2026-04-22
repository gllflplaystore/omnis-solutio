import { BarChart2 } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/hooks/useLocale";
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from "@/constants/locales";
import ProductShowcase from "@/components/ProductShowcase";
import AIChatButton from "@/components/AIChatButton";
import MultiCurrency from "@/assets/MultiCurrency.svg";
import * as Badge from "@/components/ui/Badge";
import MCUseCase from "../sections/MCUseCase";
// import Faq03 from "@/components/sections/FaqSection";
import Faq03 from "@/countries/ae/sections/FaqSection";
import SolutionSection from "../sections/SolutionSection";

const brands = [
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-1-400.svg",
    alt: "Brand 1",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-2-400.svg",
    alt: "Brand 2",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-3-400.svg",
    alt: "Brand 3",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-4-400.svg",
    alt: "Brand 4",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-5-400.svg",
    alt: "Brand 5",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-6-400.svg",
    alt: "Brand 6",
  },
  {
    src: "https://alignui.com/images/blocks/hero-1-brand-7-400.svg",
    alt: "Brand 7",
  },
];

export default function UAESolutionsPage() {
  const { t } = useTranslation();
  const { country, language, isRTL } = useLocale();

  const base =
    country === DEFAULT_COUNTRY && language === DEFAULT_LANGUAGE
      ? ""
      : `/${country}/${language}`;
  const contactHref = `${base}/contact`;

  return (
    <div className={clsx("w-full", isRTL && "text-right")}>
      <ProductShowcase
        id="multi-currency"
        imagePosition="right"
        image={<img src={MultiCurrency} alt="Multi Currency" />}
        tagIcon={<BarChart2 size={13} />}
        tag={t("multiCurrency.tag")}
        headline={t("multiCurrency.headline")}
        description={t("multiCurrency.description")}
        features={[]}
        ctaHref={contactHref}
        ctaLabel={t("multiCurrency.cta")}
      />

      {/* BRANDS */}
      <div className="border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center overflow-x-auto lg:overflow-visible">
            {brands.map((brand, index) => (
              <div
                key={brand.src}
                className="flex shrink-0 items-center lg:w-full lg:shrink"
              >
                <div className="flex w-full items-center justify-center px-5 py-6 lg:px-0">
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    width={106}
                    height={24}
                    className="h-6 w-auto opacity-60 transition hover:opacity-100"
                  />
                </div>

                {index !== brands.length - 1 && (
                  <div className="h-8 w-px shrink-0 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="w-full mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("multiCurrency.tag")}
          </Badge.Root>

          <h1 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-[550]">
            {t("multiCurrency.headline")}
          </h1>

          <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
            {t("multiCurrency.description")}
          </p>
        </div>
      </section>

      <MCUseCase />
      <SolutionSection />

      <Faq03 />

      <AIChatButton />
    </div>
  );
}
