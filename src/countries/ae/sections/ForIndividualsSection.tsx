import { useState } from "react";
import { clsx } from "clsx";
import { ArrowUpRight, Play } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams } from "react-router-dom";
import ForIndividuals from "@/assets/ForIndividuals.svg";
import Content from "@/assets/Content.svg";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";

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
      label: "Multicurrency wallet",
      img: ForIndividuals,
      alt: "Multicurrency wallet",
    },
    {
      id: "prepaid" as const,
      label: "Prepaid cards",
      img: Content,
      alt: "Prepaid cards",
    },
  ];

  return (
    <>
      <section
        id="for-individuals"
        className={clsx("w-full px-4 py-24", "sm:px-6 lg:px-8")}
      >
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          {/* Badge */}
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("forIndividuals.badge")}
          </Badge.Root>

          {/* Headline */}
          <h2 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 mb-4 font-[550] lg:text-center">
            {t("forIndividuals.headline")}
          </h2>

          {/* Subheading */}
          <p className="text-paragraph-md text-text-sub-600 lg:text-center">
            {t("forIndividuals.subheading")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
                "bg-white/10 text-white border border-white/10",
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
      </section>
      {/* Tab switcher */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-24 flex flex-col items-center">
        <div className="mb-6 flex w-full border-t border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative flex-1 py-3 text-sm font-medium transition-colors text-center",
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
        {tabs.map((tab) => (
          <img
            key={tab.id}
            src={tab.img}
            alt={tab.alt}
            className={clsx(
              "transition-opacity duration-300",
              activeTab === tab.id ? "block" : "hidden",
            )}
          />
        ))}
      </div>
      <DividerComp />
    </>
  );
}
