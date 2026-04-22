import {
  type RemixiconComponentType,
  RiAccountBoxFill,
  RiNotificationFill,
  RiSettingsFill,
  RiUserCommunityFill,
} from "@remixicon/react";
import PhoneMockup from "@/assets/Phone Mockup.svg";
import * as Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import DividerComp from "@/components/DividerComp";

type FeatureEntry = {
  id: string;
  spanClass: string;
  icon: RemixiconComponentType;
  iconColor: string;
  titleKey: string;
  descriptionKey?: string;
  bulletKeys?: string[];
  hasPhoneMockup?: boolean;
};

const featuresLayout: FeatureEntry[] = [
  {
    id: "account_aggregation",
    spanClass: "lg:col-span-4",
    icon: RiAccountBoxFill,
    iconColor: "text-warning-base",
    titleKey: "uaeSolutionsUseCases.account_aggregation_title",
    bulletKeys: [
      "uaeSolutionsUseCases.account_aggregation_point_1",
      "uaeSolutionsUseCases.account_aggregation_point_2",
      "uaeSolutionsUseCases.account_aggregation_point_3",
    ],
  },
  {
    id: "initiating_payments",
    spanClass: "lg:col-span-8",
    icon: RiSettingsFill,
    iconColor: "text-warning-base",
    titleKey: "uaeSolutionsUseCases.initiating_payments_title",
    bulletKeys: [
      "uaeSolutionsUseCases.initiating_payments_point_1",
      "uaeSolutionsUseCases.initiating_payments_point_2",
      "uaeSolutionsUseCases.initiating_payments_point_3",
    ],
    hasPhoneMockup: true,
  },
  {
    id: "financial_insights",
    spanClass: "lg:col-span-8",
    icon: RiUserCommunityFill,
    iconColor: "text-warning-base",
    titleKey: "uaeSolutionsUseCases.financial_insights_title",
    bulletKeys: [
      "uaeSolutionsUseCases.financial_insights_point_1",
      "uaeSolutionsUseCases.financial_insights_point_2",
      "uaeSolutionsUseCases.financial_insights_point_3",
    ],
    hasPhoneMockup: true,
  },
  {
    id: "subscriptions",
    spanClass: "lg:col-span-4",
    icon: RiNotificationFill,
    iconColor: "text-warning-base",
    titleKey: "uaeSolutionsUseCases.subscriptions_title",
    descriptionKey: "uaeSolutionsUseCases.subscriptions_desc",
  },
];

export default function SolutionSection() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-(--color-neutral-950) pt-10 lg:pt-20">
      <div className="mx-auto mb-24 flex max-w-7xl flex-col px-6 lg:px-7">
        <div className="mb-8 flex flex-col lg:mb-12 lg:items-center">
          <Badge.Root
            variant="lighter"
            className="text-(--color-orange-500) bg-(--color-orange-alpha-16) text-label-sm mb-3 h-7 w-fit rounded-[9px] px-2.5 uppercase"
          >
            <Badge.Dot className="text-(--color-orange-500) mx-0 size-4 before:size-1.5" />
            {t("uaeSolutionsUseCases.badge")}
          </Badge.Root>
          <h3 className="text-title-h5 lg:text-title-h4 xl:text-title-h3 text-(--color-neutral-0) font-[550] lg:text-center">
            {t("uaeSolutionsUseCases.headline")}
          </h3>
          <p className="text-label-md lg:text-label-lg text-(--color-neutral-400) mt-3 lg:max-w-132 lg:text-center">
            {t("uaeSolutionsUseCases.subheading")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-1.5">
          {featuresLayout.map((feature) => (
            <div
              key={feature.id}
              className={`${feature.spanClass} bg-(--color-neutral-900) relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[28px] p-6 lg:h-101 lg:rounded-[40px] lg:p-12`}
            >
              <div className="bg-(--color-neutral-950) rounded-20 shadow-custom-input-4 z-10 flex size-12 items-center justify-center">
                <feature.icon className={`size-8 ${feature.iconColor}`} />
              </div>
              <div className="z-10 flex max-w-77 flex-col gap-2">
                <h5 className="text-title-h6 text-(--color-neutral-0)">
                  {t(feature.titleKey)}
                </h5>
                {feature.bulletKeys ? (
                  <ul className="text-label-md text-(--color-neutral-400) list-disc pl-5">
                    {feature.bulletKeys.map((bulletKey) => (
                      <li key={bulletKey}>{t(bulletKey)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-label-md text-(--color-neutral-400)">
                    {feature.descriptionKey ? t(feature.descriptionKey) : ""}
                  </p>
                )}
              </div>
              {feature.hasPhoneMockup && (
                <img
                  src={PhoneMockup}
                  alt="Phone Mockup"
                  className="pointer-events-none absolute -bottom-1 right-8 hidden h-85 w-auto object-contain lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <DividerComp />
    </div>
  );
}
