import {
  type RemixiconComponentType,
  RiArrowLeftRightLine,
  RiBankCardLine,
  RiBillLine,
  RiBrainLine,
  RiPieChartLine,
} from "@remixicon/react";
import PhoneMockup from "@/assets/Phone Mockup.svg";
import * as Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import DividerComp from "@/components/DividerComp";

type FeatureEntry = {
  id: string;
  icon: RemixiconComponentType;
  iconColor: string;
  titleKey: string;
  descKey: string;
};

const featuresLayout: FeatureEntry[][] = [
  [
    {
      id: "feature1",
      icon: RiBrainLine,
      iconColor: "text-warning-base",
      titleKey: "solutions.open_banking_title",
      descKey: "solutions.open_banking_desc",
    },
    {
      id: "feature2",
      icon: RiBillLine,
      iconColor: "text-error-base",
      titleKey: "solutions.vault_title",
      descKey: "solutions.vault_desc",
    },
  ],
  [
    {
      id: "feature3",
      icon: RiPieChartLine,
      iconColor: "text-information-base",
      titleKey: "solutions.cross_border_title",
      descKey: "solutions.cross_border_desc",
    },
  ],
  [
    {
      id: "feature4",
      icon: RiBankCardLine,
      iconColor: "text-feature-base",
      titleKey: "solutions.bulk_payments_title",
      descKey: "solutions.bulk_payments_desc",
    },
    {
      id: "feature5",
      icon: RiArrowLeftRightLine,
      iconColor: "text-highlighted-base",
      titleKey: "solutions.payouts_title",
      descKey: "solutions.payouts_desc",
    },
  ],
];

export default function Features01() {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-white-0 py-10 lg:py-20 w-full">
      <div className="mx-auto flex max-w-7xl flex-col px-6 lg:px-7 mb-24">
        <div className="mb-6 flex flex-col lg:mb-12 lg:items-center">
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("solutions.badge")}
          </Badge.Root>
          <h3 className="text-title-h5 lg:text-title-h4 xl:text-title-h3 text-text-strong-950 font-[550] lg:text-center">
            {t("solutions.headline")}
          </h3>
          <p className="text-label-md lg:text-label-lg text-text-soft-400 mt-3 lg:text-center">
            {t("solutions.subheading")}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row">
          {featuresLayout.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={
                group.length > 1
                  ? "flex flex-col gap-2 md:flex-row lg:flex-col"
                  : "flex"
              }
            >
              {group.map((feature) => (
                <div
                  key={feature.id}
                  className="rounded-20 bg-bg-weak-50 flex w-full flex-col justify-between gap-6 p-6 lg:gap-8 lg:rounded-3xl lg:p-8 xl:gap-10 xl:p-10"
                >
                  <div className="bg-bg-white-0 rounded-10 shadow-custom-input-4 flex size-10 items-center justify-center lg:size-12 lg:rounded-xl">
                    <feature.icon
                      className={`size-6 lg:size-7 ${feature.iconColor}`}
                    />
                  </div>
                  {feature.id === "feature3" && (
                    <img
                      src={PhoneMockup}
                      alt="Phone Mockup"
                      className="w-full object-contain"
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    <h5 className="text-label-md lg:text-label-lg text-text-strong-950">
                      {t(feature.titleKey)}
                    </h5>
                    <p className="text-label-sm lg:text-label-md text-text-soft-400">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <DividerComp />
    </div>
  );
}
