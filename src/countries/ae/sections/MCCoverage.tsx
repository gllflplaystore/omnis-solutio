import {
  RiArrowUpDownLine,
  RiBankLine,
  RiLockLine,
  RiPieChartLine,
  type RemixiconComponentType,
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
];

function MCCoverage() {
  const { t } = useTranslation();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="w-full mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("multiCurrency.tag")}
          </Badge.Root>

          <h1 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-[550]">
            {t("multiCurrency.headline")}
          </h1>

          <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
            {t("multiCurrency.description")}
          </p>
        </div>
      </section>
      <div className="max-w-7xl lg:px-7 flex flex-col mx-auto my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3">
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
    </>
  );
}

export default MCCoverage;
