import { useState } from "react";
import {
  type RemixiconComponentType,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCustomerServiceFill,
  RiQuestionFill,
  RiShieldStarFill,
  RiStarSmileFill,
  RiUser4Fill,
  RiLoginBoxFill,
} from "@remixicon/react";
import * as Accordion from "@/components/ui/Accordion";
import * as Badge from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import DividerComp from "@/components/DividerComp";

const TAB_ICONS: Record<string, RemixiconComponentType> = {
  general: RiUser4Fill,
  onboarding: RiLoginBoxFill,
  payouts: RiCustomerServiceFill,
  settlement: RiShieldStarFill,
  api: RiStarSmileFill,
};

const TAB_IDS = [
  "general",
  "onboarding",
  "payouts",
  "settlement",
  "api",
] as const;

const FAQ_KEYS: Record<string, string[]> = {
  general: ["q1", "q2", "q3", "q4", "q5"],
  onboarding: ["q1", "q2", "q3"],
  payouts: ["q1", "q2", "q3", "q4"],
  settlement: ["q1", "q2", "q3"],
  api: ["q1", "q2", "q3"],
};

export default function Faq03() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");

  const tabsData = TAB_IDS.map((id) => ({
    id,
    label: t(`faq.tab_${id}`),
    icon: TAB_ICONS[id],
  }));

  const faqData = Object.fromEntries(
    TAB_IDS.map((tabId) => [
      tabId,
      FAQ_KEYS[tabId].map((qKey, i) => ({
        id: `${tabId}-${i}`,
        question: t(`faq.${tabId}_${qKey}`),
        answer: t(`faq.${tabId}_${qKey.replace("q", "a")}`),
      })),
    ]),
  );
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const tabOrder: string[] = tabsData.map((tab) => tab.id);
  const currentIndex = tabOrder.indexOf(activeTab);
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setActiveTab(tabOrder[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex >= tabOrder.length - 1) return;
    setActiveTab(tabOrder[currentIndex + 1]);
  };

  return (
    <div className="bg-bg-white-0 px-6 lg:px-0 lg:mt-24 w-full">
      <div className="mx-auto flex flex-col items-center lg:max-w-183.5 mb-24">
        <Badge.Root
          variant="filled"
          className="text-label-sm bg-bg-weak-50 text-(--color-primary-base) mb-3 h-7 w-fit gap-1.5 rounded-[9px] pr-2.5 pl-2 normal-case lg:mx-auto"
        >
          <Badge.Icon
            as={RiQuestionFill}
            className="text-(--color-primary-base) mx-0 size-4 before:size-4"
          />
          {t("faq.badge")}
        </Badge.Root>
        <div className="text-title-h4 lg:text-title-h2 text-stroke-strong-950 mb-4 font-[550] lg:text-center">
          {t("faq.headline")}
        </div>
        <div className="text-text-sub-600 text-paragraph-md mb-6 lg:mb-8 lg:text-center">
          {t("faq.subheading")}
        </div>

        <div className="border-stroke-soft-200 relative mb-6 flex w-[calc(100%+48px)] overflow-hidden border-t border-b lg:hidden">
          <RiArrowLeftSLine
            onClick={handlePrev}
            className={`${currentIndex <= 0 ? "pointer-events-none opacity-30" : "cursor-pointer"} text-text-soft-400 absolute top-1/2 left-6 z-10 size-5 -translate-y-1/2 transition-all duration-300`}
          />
          <RiArrowRightSLine
            onClick={handleNext}
            className={`${currentIndex >= tabOrder.length - 1 ? "pointer-events-none opacity-30" : "cursor-pointer"} text-text-soft-400 absolute top-1/2 right-6 z-10 size-5 -translate-y-1/2 transition-all duration-300`}
          />
          <div
            className="flex w-full flex-nowrap transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {tabsData.map((tab) => (
              <div
                key={tab.id}
                className="group/tab hover:bg-bg-white-0 hover:text-text-strong-950 flex w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 px-13 py-4 shadow-none transition-all duration-300"
                data-tab={tab.id}
                data-active={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
              >
                <tab.icon className="text-text-disabled-300 group-data-[active=true]/tab:text-information-base size-4.5 transition-all duration-300" />
                <span className="text-label-sm text-text-sub-600 group-data-[active=true]/tab:text-text-strong-950 transition-all duration-300">
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-weak-50 mx-auto mb-8 hidden w-fit gap-1 rounded-[96px] p-1 lg:flex">
          {tabsData.map((tab) => (
            <div
              key={tab.id}
              className="group/tab hover:bg-bg-white-0 hover:text-text-strong-950 data-[active=true]:bg-bg-white-0 data-[active=true]:shadow-custom-input-4 flex cursor-pointer items-center gap-1.5 rounded-[96px] px-3 py-2 shadow-none transition-all duration-300"
              data-tab={tab.id}
              data-active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              <tab.icon className="text-text-disabled-300 group-data-[active=true]/tab:text-information-base size-4.5 transition-all duration-300" />
              <span className="text-label-sm text-text-sub-600 group-data-[active=true]/tab:text-text-strong-950 transition-all duration-300">
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex w-full lg:w-fit">
          {tabsData.map((tab) => (
            <Accordion.Root
              key={tab.id}
              type="single"
              collapsible
              className="mx-auto mb-6 w-full space-y-3 lg:mb-8 lg:w-[800px]"
              data-tab={tab.id}
              hidden={activeTab !== tab.id}
            >
              {faqData[tab.id]?.map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="ring-stroke-soft-200 cursor-pointer !rounded-2xl px-5 py-3.5 duration-300"
                >
                  <Accordion.Trigger className="text-text-sub-600 text-label-sm lg:text-label-md group-hover/accordion:text-text-strong-950 group-data-[state=open]/accordion:text-text-strong-950 flex cursor-pointer items-start gap-2 duration-300 lg:items-center">
                    {faq.question}
                    <Accordion.Arrow className="text-text-soft-400 group-[&[data-state=open]]/accordion:text-text-sub-600 group-hover/accordion:text-text-strong-950 mb-[-3px] ml-auto size-6 duration-300 lg:mb-0" />
                  </Accordion.Trigger>
                  <Accordion.Content className="flex flex-col gap-4 pt-3.5 pb-1.5 lg:gap-5">
                    <div className="text-label-sm text-text-sub-600">
                      {faq.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          ))}
        </div>
        <div className="text-text-soft-400 text-paragraph-sm flex flex-col items-center text-center">
          {t("faq.contact_label")} <br className="block lg:hidden" />{" "}
          <Link
            to="mailto:hello@omnissolutio.com"
            className="text-label-sm text-text-sub-600 hover:text-text-strong-950 transition-all duration-300"
          >
            {" "}
            hello@omnissolutio.com
          </Link>
        </div>
      </div>
      <DividerComp />
    </div>
  );
}
