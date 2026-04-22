import { clsx } from "clsx";
import { useTranslation } from "@/hooks/useTranslation";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";
import BrandLogo from "@/components/BrandLogo";
import Container from "@/components/ui/Container";

export default function WhoWeAreSection() {
  const { t } = useTranslation();

  return (
    <>
      <section id="home" className="w-full py-10 md:py-14">
        <Container className="flex flex-col items-center gap-14 lg:flex-row lg:items-center">
          {/* Left — text content */}
          <div className="flex-1 flex flex-col gap-5 items-start">
            {/* Heading group: badge + headline */}
            {/* Badge */}
            <Badge.Root
              variant="light"
              color="orange"
              size="medium"
              className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto"
            >
              <Badge.Dot className="animate-pulse" />
              {t("whoWeAre.badge")}
            </Badge.Root>

            {/* Headline */}
            <h2
              className={clsx(
                "text-title-h5 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-semibold tracking-[-0.4px] md:max-w-3xl",
                "text-(--color-text-strong-950)",
              )}
              style={{ fontFeatureSettings: "'calt' 0, 'liga' 0" }}
            >
              {t("whoWeAre.headline")}
            </h2>

            {/* Body paragraphs — matches Figma node 2001:25125 */}
            <div
              className="text-label-sm md:text-label-md leading-6 tracking-[-0.176px] text-(--color-text-sub-600) md:max-w-2xl"
              style={{ fontFeatureSettings: "'ss11' 1, 'calt' 0, 'liga' 0" }}
            >
              <p className="mb-2">{t("whoWeAre.bodyLine1")}</p>
              {t("whoWeAre.bodyLine2") && (
                <p className="mb-2">{t("whoWeAre.bodyLine2")}</p>
              )}
              {t("whoWeAre.bodyLine3") && <p>{t("whoWeAre.bodyLine3")}</p>}
            </div>
          </div>

          {/* Right — brand image */}
          <div className="flex-1 relative shrink-0 rounded-[36px] overflow-hidden w-full lg:w-170 h-130 flex items-center justify-center">
            <BrandLogo />
          </div>
        </Container>
      </section>
      <DividerComp />
    </>
  );
}
