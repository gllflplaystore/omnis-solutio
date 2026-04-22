import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams } from "react-router-dom";
import GlobeWrapper from "@/components/GlobeWrapper";
import GlobalNetwork from "@/components/GlobeNetwork";
import * as Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";

export default function HeroSection() {
  const { t } = useTranslation();
  const { country = "global", lang = "en" } = useParams<{
    country: string;
    lang: string;
  }>();

  const marqueeItems = [
    "Global Payment Gateway",
    "Multi-Currency Support",
    "Cross-Border Payments",
    "Secure Online Payments",
    "AI-Enabled Enhancements",
    "Chargeback Protection",
    "PCI DSS Compliant",
    "Payment Gateway API",
  ];

  return (
    <>
      <section id="home" className="py-10 md:py-14">
        <Container className="flex flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:items-center lg:gap-14">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col items-start gap-6">
            <Badge.Root
              variant="light"
              color="orange"
              size="medium"
              className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto"
            >
              <Badge.Dot className="animate-pulse" />
              {t("hero.tagline")}
            </Badge.Root>

            {/* Headline */}
            <h1 className="text-3xl font-medium text-white leading-snug tracking-tight sm:text-4xl lg:text-5xl">
              {t("hero.headline")}
            </h1>

            {/* Subheading */}
            <p className="max-w-xl text-base text-white/45 leading-relaxed">
              {t("hero.subheading")}
            </p>

            {/* CTA */}
            <div className="pt-4">
              <a
                href={`/${country}/${lang}#contact`}
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600"
              >
                {t("hero.cta_primary")}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - Globe */}
          <div className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-none lg:w-auto shrink-0 flex items-center justify-center">
            <div className="relative w-full aspect-square">
              {/* Subtle glow (Same as WhoWeAre) */}
              <div className="absolute inset-0 rounded-full bg-white/3 blur-3xl" />
              <GlobeWrapper>
                <GlobalNetwork />
              </GlobeWrapper>
            </div>
          </div>
        </Container>
      </section>

      <section className="w-full overflow-hidden">
        {/* MARQUEE */}
        <Container>
          <div className="border-y border-(--color-stroke-soft-200) mt-10 sm:mt-14 lg:mt-0 py-5 sm:py-6 flex items-center justify-center     w-full overflow-hidden">
            {/* fade masks on both edges */}
            <div className="w-full relative overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
              <div className="flex animate-marquee w-max">
                {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex shrink-0 items-center gap-2 sm:gap-3 px-3 sm:px-5 lg:px-6"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-stroke-sub-300) sm:h-2 sm:w-2" />
                      <span className="whitespace-nowrap text-xs sm:text-sm lg:text-base font-medium uppercase tracking-widest text-(--color-text-soft-400)">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
