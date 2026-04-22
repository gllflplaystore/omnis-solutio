import {
  type RemixiconComponentType,
  RiLockLine,
  RiPieChartLine,
  RiArrowUpDownLine,
  RiBankLine,
  RiHeadphoneLine,
  RiCodeSSlashLine,
} from "@remixicon/react";
import * as Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import DividerComp from "@/components/DividerComp";

type FinanceCard = {
  id: string;
  icon: RemixiconComponentType;
  iconColor: string;
  titleKey: string;
  descKey: string;
};

const cardsConfig: FinanceCard[] = [
  {
    id: "perm",
    icon: RiLockLine,
    iconColor: "text-warning-base",
    titleKey: "finance.perm_title",
    descKey: "finance.perm_desc",
  },
  {
    id: "report",
    icon: RiPieChartLine,
    iconColor: "text-information-base",
    titleKey: "finance.report_title",
    descKey: "finance.report_desc",
  },
  {
    id: "approval",
    icon: RiArrowUpDownLine,
    iconColor: "text-error-base",
    titleKey: "finance.approval_title",
    descKey: "finance.approval_desc",
  },
  {
    id: "compliance",
    icon: RiBankLine,
    iconColor: "text-feature-base",
    titleKey: "finance.compliance_title",
    descKey: "finance.compliance_desc",
  },
  {
    id: "support",
    icon: RiHeadphoneLine,
    iconColor: "text-highlighted-base",
    titleKey: "finance.support_title",
    descKey: "finance.support_desc",
  },
  {
    id: "api",
    icon: RiCodeSSlashLine,
    iconColor: "text-success-base",
    titleKey: "finance.api_title",
    descKey: "finance.api_desc",
  },
];

export default function Integrations04() {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-white-0 w-full mt-24">
      <div className="max-w-7xl lg:px-7 flex flex-col mx-auto mb-24">
        <div className="flex flex-col lg:items-center px-6 lg:px-0 mb-8 lg:mb-12">
          <Badge.Root
            variant="lighter"
            className="w-fit px-2.5 h-7 text-label-sm text-text-sub-600 capitalize rounded-[9px] bg-bg-weak-50 mb-3 lg:mx-auto"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("finance.badge")}
          </Badge.Root>
          <h3 className="text-title-h4 xl:text-title-h3 font-[550] text-text-strong-950 lg:text-center">
            {t("finance.headline")}
          </h3>
          <p className="text-paragraph-md text-text-sub-600 mt-3 lg:text-center">
            {t("finance.subheading_regular")}{" "}
            <span className="text-label-md text-text-sub-600">
              {t("finance.subheading_bold")}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 px-3">
          {cardsConfig.map((card) => (
            <div
              key={card.id}
              className="flex flex-col p-7 xl:p-10 gap-7 xl:gap-10 bg-bg-weak-50 rounded-[28px]"
            >
              <div className="size-12 shadow-custom-input-4 rounded-[14px] flex items-center justify-center shrink-0 bg-bg-white-0">
                <card.icon className={`size-6 ${card.iconColor}`} />
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-label-lg text-text-strong-950">
                  {t(card.titleKey)}
                </h5>
                <p className="text-label-md text-text-sub-600">
                  {t(card.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DividerComp />
    </div>
  );
}
