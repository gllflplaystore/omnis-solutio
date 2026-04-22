import clsx from "clsx";
import * as Badge from "@/components/ui/Badge";
import { ArrowUpRight, Play } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useState } from "react";
import {
  RiCalendarCheckLine,
  RiHeart3Line,
  RiQuestionAnswerLine,
  RiTimerFill,
} from "@remixicon/react";
import DividerComp from "@/components/DividerComp";

const tabs = [
  {
    id: "time-tracking",
    icon: RiTimerFill,
    title: "Smart time tracking",
    description: "Manage leave and attendance",
    image: "https://alignui.com/images/blocks/hero-2-image-1.png",
    imageMobile: "https://alignui.com/images/blocks/hero-2-image-1-mobile.png",
  },
  {
    id: "feedback",
    icon: RiQuestionAnswerLine,
    title: "Real-time feedback",
    description: "Stay connected as one network",
    image: "https://alignui.com/images/blocks/hero-2-image-1.png",
    imageMobile: "https://alignui.com/images/blocks/hero-2-image-1-mobile.png",
  },
  {
    id: "scheduling",
    icon: RiCalendarCheckLine,
    title: "Simplified scheduling",
    description: "Simplify daily team planning",
    image: "https://alignui.com/images/blocks/hero-2-image-1.png",
    imageMobile: "https://alignui.com/images/blocks/hero-2-image-1-mobile.png",
  },
  {
    id: "visibility",
    icon: RiHeart3Line,
    title: "Employee visibility",
    description: "Track morale and engagement",
    image: "https://alignui.com/images/blocks/hero-2-image-1.png",
    imageMobile: "https://alignui.com/images/blocks/hero-2-image-1-mobile.png",
  },
];

function MCPaymentInt() {
  const { t } = useTranslation();
  const { country = "global", lang = "en" } = useParams<{
    country: string;
    lang: string;
  }>();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <>
      <section className={clsx("w-full px-4 py-24", "sm:px-6 lg:px-8")}>
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
        <div className="mt-8 flex flex-col lg:mt-14">
          <div className="border-stroke-soft-200 relative flex flex-col border-t px-2 lg:flex-row lg:px-0">
            <div
              className="bg-(--color-primary-base) absolute -top-0.25 left-0 hidden h-0.25 transition-all duration-300 ease-out lg:block"
              style={{
                width: `${100 / tabs.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isFirst = index === 0;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group border-stroke-soft-200 relative flex flex-1 cursor-pointer items-center border-b py-5 transition-all duration-300 lg:border-b-0 lg:py-8",
                    index === tabs.length - 1 && "border-b-0",
                  )}
                >
                  <div
                    className={cn(
                      "bg-(--color-primary-base) absolute -top-0.25 -left-6 h-0.25 w-[calc(100%+48px)] transition-all duration-300 lg:hidden",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div
                    className={cn(
                      "border-l-stroke-soft-200 flex w-full items-center gap-3.5 transition-all duration-300 lg:gap-2 xl:gap-3.5",
                      !isFirst && "lg:border-l lg:pl-3 xl:pl-7",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-bg-white-0 flex items-center justify-center rounded-xl p-2 transition-all duration-300 lg:p-1.5 xl:p-2",
                        isActive
                          ? "border-(--color-primary-base) border"
                          : "border-stroke-soft-200 group-hover:border-text-soft-400 border",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 transition-colors duration-300 lg:size-4 xl:size-5",
                          isActive
                            ? "text-(--color-primary-base)"
                            : "text-text-soft-400 group-hover:text-text-sub-600",
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={cn(
                          "text-label-sm flex transition-colors duration-300",
                          isActive
                            ? "text-text-strong-950"
                            : "text-text-sub-600 group-hover:text-text-strong-950",
                        )}
                      >
                        {tab.title}
                      </span>
                      <span className="text-label-xs text-text-soft-400">
                        {tab.description}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px]">
            <img
              src="https://alignui.com/images/blocks/hero-2-bg.png"
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute bottom-0 z-10 h-19 w-full rounded-b-[32px] bg-[linear-gradient(180deg,rgba(120,77,239,0.00)_0%,rgba(120,77,239,0.04)_100%)] md:rounded-b-[40px]"></div>

            <div className="relative mx-5 md:mx-[60px] lg:mx-[120px]">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={cn(
                    "top-[56px] w-full transition-all duration-500 md:top-[80px] md:w-auto",
                    activeTab === tab.id
                      ? "relative opacity-100"
                      : "pointer-events-none absolute opacity-0",
                  )}
                >
                  <img
                    src={tab.image}
                    alt={tab.title}
                    width={984}
                    height={658}
                    className="shadow-complex-11 hidden h-auto w-full rounded-3xl md:block"
                  />
                  <img
                    src={tab.imageMobile}
                    alt={tab.title}
                    width={318}
                    height={688}
                    className="shadow-complex-11 rounded-20 mx-auto h-auto max-h-[500px] w-full object-cover object-top sm:w-2/3 md:hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <DividerComp />
    </>
  );
}

export default MCPaymentInt;
