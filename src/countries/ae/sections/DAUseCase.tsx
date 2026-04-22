import DividerComp from "@/components/DividerComp";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RiArrowUpDownLine,
  RiBankLine,
  RiLockLine,
  RiPieChartLine,
  type RemixiconComponentType,
} from "@remixicon/react";

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
    titleKey: "daUseCase.perm_title",
    descKey: "daUseCase.perm_desc",
  },
  {
    id: "report",
    icon: RiPieChartLine,
    iconColor: "text-information-base",
    titleKey: "daUseCase.report_title",
    descKey: "daUseCase.report_desc",
  },
  {
    id: "approval",
    icon: RiArrowUpDownLine,
    iconColor: "text-error-base",
    titleKey: "daUseCase.approval_title",
    descKey: "daUseCase.approval_desc",
  },
  {
    id: "compliance",
    icon: RiBankLine,
    iconColor: "text-feature-base",
    titleKey: "daUseCase.compliance_title",
    descKey: "daUseCase.compliance_desc",
  },
];

function DAUseCase() {
  const { t } = useTranslation();

  return (
    <>
      <div className="max-w-7xl lg:px-7 flex flex-col mx-auto my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3">
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

export default DAUseCase;
