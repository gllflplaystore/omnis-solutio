import { useEffect, useState } from "react";
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
import Container from "@/components/ui/Container";
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
    <div className="flex h-full w-full flex-col overflow-hidden rounded-4xl border border-white/8 bg-white/4">
      {/* Upper content */}
      <div className="flex flex-1 flex-col gap-7 px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-7 lg:gap-9 lg:px-9 lg:pb-9 lg:pt-9">
        <div className="inline-flex items-center justify-center self-start rounded-2xl bg-white/8 p-2.5">
          <Icon className="h-6 w-6 text-orange-400" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg leading-snug font-medium tracking-tight text-white sm:text-xl">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-white/50 sm:text-base">
              {description}
            </p>
          </div>
          <button className="flex w-fit items-center gap-1 text-sm text-white/50 transition-colors hover:text-white/80 sm:text-base">
            {learnMore}
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Bottom image area */}
      <div className="mx-3 mb-3 flex min-h-44 items-end overflow-hidden rounded-2xl border border-white/6 bg-white/4 sm:mx-4 sm:mb-4 sm:min-h-52">
        {image ?? null}
      </div>
    </div>
  );
}

export default function ValueAddedFeaturesSection() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(3);

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

  useEffect(() => {
    const updateCardsVisible = () => {
      if (window.innerWidth < 768) {
        setCardsVisible(1);
        return;
      }

      if (window.innerWidth < 1280) {
        setCardsVisible(2);
        return;
      }

      setCardsVisible(3);
    };

    updateCardsVisible();
    window.addEventListener("resize", updateCardsVisible);
    return () => window.removeEventListener("resize", updateCardsVisible);
  }, []);

  const maxIndex = Math.max(0, cards.length - cardsVisible);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  // Gap between cards in px — must match the gap-6 below (24px)
  const GAP = 24;
  // Each step moves by one card plus its share of the track gap.
  const translateX = `calc(-${index} * (100% / ${cardsVisible} + ${GAP / cardsVisible}px))`;

  return (
    <>
      <section
        id="value-added-features"
        className="w-full overflow-hidden py-10 md:py-14"
      >
        <Container>
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:gap-5">
            {/* Badge */}
            <Badge.Root
              variant="light"
              color="orange"
              size="medium"
              className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto"
            >
              <Badge.Dot className="animate-pulse" />
              {t("valueAdded.badge")}
            </Badge.Root>
            <h2 className="text-title-h5 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-semibold lg:text-center">
              {t("valueAdded.headline")}
            </h2>
            <p className="text-label-sm md:text-label-md text-text-sub-600 lg:text-center">
              {t("valueAdded.subheading")}
            </p>
          </div>

          {/* Carousel viewport */}
          <div className="mx-auto pt-10 sm:pt-14">
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
                      width: `calc((100% - ${GAP * (cardsVisible - 1)}px) / ${cardsVisible})`,
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
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 sm:h-11 sm:w-11"
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 sm:h-11 sm:w-11"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </Container>
      </section>
      <DividerComp />
    </>
  );
}
