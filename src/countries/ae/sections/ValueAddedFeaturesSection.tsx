import { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  Zap,
  Puzzle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";
import Recipent from "@/assets/Recipient.svg";

// ─── Card ────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  learnMore,
  image,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  learnMore: string;
  image?: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full flex-col rounded-4xl border border-white/8 bg-white/4 overflow-hidden">
      {/* Upper content */}
      <div className="flex flex-1 flex-col gap-9 px-9 pt-9 pb-9">
        <div className="inline-flex items-center justify-center self-start rounded-2xl bg-white/8 p-2.5">
          <Icon className="h-6 w-6 text-orange-400" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium tracking-tight text-white leading-snug">
              {title}
            </h3>
            <p className="text-base text-white/50 leading-relaxed">
              {description}
            </p>
          </div>
          <button className="flex items-center gap-1 text-base text-white/50 hover:text-white/80 transition-colors w-fit">
            {learnMore}
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Bottom image area */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white/4 border border-white/6 min-h-52 flex items-end">
        {image ?? null}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────
const CARDS_VISIBLE = 3; // how many cards show at once on desktop

export default function ValueAddedFeaturesSection() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const cards = [
    {
      icon: Landmark,
      titleKey: "valueAdded.button_title" as const,
      descKey: "valueAdded.button_desc" as const,
      image: <img src={Recipent} alt="" className="w-full object-cover" />,
    },
    {
      icon: ShieldCheck,
      titleKey: "valueAdded.invoice_title" as const,
      descKey: "valueAdded.invoice_desc" as const,
      image: <img src={Recipent} alt="" className="w-full object-cover" />,
    },
    {
      icon: Zap,
      titleKey: "valueAdded.subscription_title" as const,
      descKey: "valueAdded.subscription_desc" as const,
      image: <img src={Recipent} alt="" className="w-full object-cover" />,
    },
    {
      icon: Puzzle,
      titleKey: "valueAdded.plugins_title" as const,
      descKey: "valueAdded.plugins_desc" as const,
      image: <img src={Recipent} alt="" className="w-full object-cover" />,
    },
  ];

  const maxIndex = cards.length - CARDS_VISIBLE;
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  // Gap between cards in px — must match the gap-6 below (24px)
  const GAP = 24;
  // Each card is (100% - 2*gap) / 3, expressed as a calc for the translate
  // We translate by (cardWidth + gap) per step = (100% / 3) of the track
  const translateX = `calc(-${index} * (100% / ${CARDS_VISIBLE} + ${GAP / CARDS_VISIBLE}px))`;

  return (
    <section id="value-added-features" className="w-full overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center mb-12">
        <Badge.Root
          variant="lighter"
          className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
        >
          <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
          {t("valueAdded.badge")}
        </Badge.Root>
        <h2 className="text-3xl font-medium tracking-tight text-white leading-snug sm:text-4xl lg:text-5xl max-w-3xl">
          {t("valueAdded.headline")}
        </h2>
        <p className="text-base text-white/45 max-w-xl leading-relaxed">
          {t("valueAdded.subheading")}
        </p>
      </div>

      {/* Carousel viewport */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="overflow-hidden">
          {/* Track — slides on translateX */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${translateX})` }}
          >
            {cards.map(({ icon, titleKey, descKey, image }) => (
              <div
                key={titleKey}
                className="shrink-0 h-full"
                style={{
                  width: `calc((100% - ${GAP * (CARDS_VISIBLE - 1)}px) / ${CARDS_VISIBLE})`,
                }}
              >
                <FeatureCard
                  icon={icon}
                  title={t(titleKey)}
                  description={t(descKey)}
                  learnMore={t("valueAdded.learn_more")}
                  image={image}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            aria-label="Previous"
            className="flex items-center justify-center h-11 w-11 rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-orange-500" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={!canNext}
            aria-label="Next"
            className="flex items-center justify-center h-11 w-11 rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
      <DividerComp />
    </section>
  );
}
