import { useState } from "react";
import { clsx } from "clsx";
import { ArrowUpRight, Play } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams } from "react-router-dom";
import ForIndividuals from "@/assets/ForIndividuals.svg";
import Content from "@/assets/Content.svg";
import DividerComp from "@/components/DividerComp";
import * as Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";

export default function ForIndividualsSection() {
  const { t } = useTranslation();
  const { country = "global", lang = "en" } = useParams<{
    country: string;
    lang: string;
  }>();

  const [activeTab, setActiveTab] = useState<"wallet" | "prepaid">("wallet");

  const tabs = [
    {
      id: "wallet" as const,
      label: "Multicurrency Wallet",
      img: ForIndividuals,
      alt: "Multicurrency wallet",
    },
    {
      id: "prepaid" as const,
      label: "Prepaid Cards",
      img: Content,
      alt: "Prepaid cards",
    },
  ];

  return (
    <>
      <section id="for-individuals" className={clsx("w-full py-10 md:py-14")}>
        <Container>
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center gap-5">
            {/* Badge */}
            <Badge.Root
              variant="light"
              color="orange"
              size="medium"
              className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto"
            >
              <Badge.Dot className="animate-pulse" />
              {t("forIndividuals.badge")}
            </Badge.Root>

            {/* Headline */}
            <h2 className="text-title-h5 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-semibold lg:text-center">
              {t("forIndividuals.headline")}
            </h2>

            {/* Subheading */}
            <p className="text-label-sm md:text-label-md text-text-sub-600 lg:text-center">
              {t("forIndividuals.subheading")}
            </p>

            {/* CTAs */}
            <div className="mt-1.5 flex flex-wrap flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`/${country}/${lang}#contact`}
                className={clsx(
                  "inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold",
                  "bg-(--color-primary-base) text-white",
                  "shadow-(--shadow-button-primary-focus) transition-opacity hover:opacity-90",
                )}
              >
                {t("forIndividuals.cta_primary")}
                <ArrowUpRight size={16} />
              </a>
              <a
                href={`/${country}/${lang}#demo`}
                className={clsx(
                  "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold",
                  "bg-bg-weak-50 text-white border border-bg-weak-50",
                  "transition-colors hover:bg-white/15",
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Play size={10} className="fill-white text-white ml-0.5" />
                </span>
                {t("forIndividuals.cta_secondary")}
              </a>
            </div>
          </div>
          {/* Tab switcher */}
          <div className="w-full py-14">
            <div className="flex w-full min-w-[260px] sm:min-w-0 border-t border-white/10 overflow-x-auto scrollbar-none ">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "relative flex-1 min-w-[140px] sm:min-w-0 h-10 sm:h-12 text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap px-2 sm:px-0",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-white/40 hover:text-white/70",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute top-0 left-0 right-0 h-0.5 rounded-full bg-(--color-primary-base)" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="grid w-full place-items-center">
            {tabs.map((tab) => (
              <img
                key={tab.id}
                src={tab.img}
                alt={tab.alt}
                className={clsx(
                  "[grid-area:1/1] transition-all duration-500 ease-in-out",
                  "w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-6xl h-auto",
                  activeTab === tab.id
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-95 z-0 pointer-events-none",
                )}
              />
            ))}
          </div>
        </Container>
      </section>
      <DividerComp />
    </>
  );
}
