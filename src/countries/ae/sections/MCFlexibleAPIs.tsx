import DividerComp from "@/components/DividerComp";
import * as Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/utils/cn";
import { useState } from "react";

const phoneScreenImage =
  "https://www.figma.com/api/mcp/asset/94d69b50-8f5e-4f1a-ab3e-0b10e891838e";

function MCFlexibleAPIs() {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: t("flexibleAPIs.feature1_title"),
      desc: t("flexibleAPIs.feature1_desc"),
    },
    {
      title: t("flexibleAPIs.feature2_title"),
      desc: t("flexibleAPIs.feature2_desc"),
    },
    {
      title: t("flexibleAPIs.feature3_title"),
      desc: t("flexibleAPIs.feature3_desc"),
    },
    {
      title: t("flexibleAPIs.feature4_title"),
      desc: t("flexibleAPIs.feature4_desc"),
    },
  ];

  return (
    <>
      <section className="w-full mt-20 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("flexibleAPIs.tag")}
          </Badge.Root>

          <h2 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-[550] mt-3">
            {t("flexibleAPIs.headline")}
          </h2>

          <p className="text-paragraph-md text-text-sub-600 max-w-2xl mt-4">
            {t("flexibleAPIs.description")}
          </p>
        </div>

        {/* Bottom: features list + phone mockup */}
        <div className="mx-auto max-w-5xl mt-10 flex flex-col lg:flex-row gap-1.5 items-stretch">
          {/* Left: feature list */}
          <div className="flex-1 bg-bg-weak-50 rounded-[40px] p-2.5 flex flex-col gap-0.5">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={cn(
                    "text-left flex flex-col gap-2 px-7 py-6 rounded-[28px] transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-bg-white-0 shadow-[0px_3px_3px_-1.5px_rgba(23,23,23,0.06),0px_1px_1px_-0.5px_rgba(23,23,23,0.06),0px_0px_0px_1px_rgba(23,23,23,0.02)]"
                      : "hover:bg-bg-white-0/50",
                  )}
                >
                  <span className="text-label-lg text-text-strong-950">
                    {feature.title}
                  </span>
                  <span className="text-paragraph-md text-text-sub-600">
                    {feature.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: phone mockup */}
          <div className="bg-bg-weak-50 rounded-[40px] flex items-end justify-center overflow-hidden lg:w-[420px] shrink-0 min-h-[480px] lg:min-h-0">
            <img
              src={phoneScreenImage}
              alt="Flexible APIs app preview"
              className="w-[320px] lg:w-[340px] h-auto object-contain object-bottom"
            />
          </div>
        </div>
      </section>
      <DividerComp />
    </>
  );
}

export default MCFlexibleAPIs;
