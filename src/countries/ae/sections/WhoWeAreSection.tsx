import { clsx } from "clsx";
import { useTranslation } from "@/hooks/useTranslation";
import BrandItemsAtomic from "@/assets/WhoWeAre.svg";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";

export default function WhoWeAreSection() {
  const { t } = useTranslation();

  return (
    <>
      <section
        id="who-we-are"
        className="w-full bg-green-950 px-4 py-20 sm:px-6 lg:px-30"
      >
        <div className="mx-auto max-w-7xl flex flex-col gap-14 items-center lg:flex-row lg:items-center">
          {/* Left — text content */}
          <div className="flex-1 flex flex-col gap-5 items-start min-w-0">
            {/* Heading group: badge + headline */}
            <div className="flex flex-col gap-3 w-full">
              {/* Badge */}
              <Badge.Root
                variant="lighter"
                className="bg-green-950 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
              >
                <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
                {t("whoWeAre.badge")}
              </Badge.Root>

              {/* Headline */}
              <h2
                className={clsx(
                  "text-[40px] leading-12 font-medium tracking-[-0.4px]",
                  "text-(--color-text-strong-950)",
                )}
                style={{ fontFeatureSettings: "'calt' 0, 'liga' 0" }}
              >
                {t("whoWeAre.headline")}
              </h2>
            </div>

            {/* Body paragraphs — matches Figma node 2001:25125 */}
            <div
              className="text-base leading-6 tracking-[-0.176px] text-(--color-text-sub-600)"
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
          <div className="relative shrink-0 rounded-[36px] overflow-hidden w-full lg:w-145 h-85.25 flex items-center justify-center">
            <img
              src={BrandItemsAtomic}
              alt="Omnis Solutio"
              className="absolute w-161.25 max-w-none h-auto"
              style={{ left: "calc(50% - 322.5px)", top: 0 }}
            />
          </div>
        </div>
      </section>
      <DividerComp />
    </>
  );
}
