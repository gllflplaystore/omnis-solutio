import { useCallback, useEffect, useRef, useState } from "react";
import { RiLoader2Line } from "@remixicon/react";
import clsx from "clsx";
import { useTranslation } from "@/hooks/useTranslation";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="size-6 shrink-0"
  >
    <path
      d="M12 21C7.0293 21 3 16.9707 3 12C3 7.0293 7.0293 3 12 3C16.9707 3 21 7.0293 21 12C21 16.9707 16.9707 21 12 21ZM11.1027 15.6L17.4657 9.2361L16.1931 7.9635L11.1027 13.0548L8.5566 10.5087L7.284 11.7813L11.1027 15.6Z"
      fill="#335CFF"
    />
  </svg>
);

export default function HowItWorks03() {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      number: "01",
      title: t("whyOmnis.step1_title"),
      description: t("whyOmnis.step1_desc"),
      image: "https://alignui.com/images/blocks/hiw-3-image-1.jpg",
    },
    {
      id: 2,
      number: "02",
      title: t("whyOmnis.step2_title"),
      description: t("whyOmnis.step2_desc"),
      image: "https://alignui.com/images/blocks/hiw-3-image-1.jpg",
    },
    {
      id: 3,
      number: "03",
      title: t("whyOmnis.step3_title"),
      description: t("whyOmnis.step3_desc"),
      image: "https://alignui.com/images/blocks/hiw-3-image-1.jpg",
    },
    {
      id: 4,
      number: "04",
      title: t("whyOmnis.step4_title"),
      description: t("whyOmnis.step4_desc"),
      image: "https://alignui.com/images/blocks/hiw-3-image-1.jpg",
    },
    {
      id: 5,
      number: "05",
      title: t("whyOmnis.step5_title"),
      description: t("whyOmnis.step5_desc"),
      image: "https://alignui.com/images/blocks/hiw-3-image-1.jpg",
    },
  ];
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setActiveStep(0);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  const goToNextStep = useCallback(() => {
    setActiveStep((prev) => {
      if (prev >= steps.length - 1) return prev;

      const next = prev + 1;
      if (prev >= 0 && !completedSteps.includes(prev)) {
        setCompletedSteps((prevCompleted) => [...prevCompleted, prev]);
      }
      return next;
    });
  }, [completedSteps]);

  useEffect(() => {
    if (!isInView || activeStep < 0) return;

    if (activeStep >= steps.length - 1) {
      const timeout = setTimeout(() => {
        if (!completedSteps.includes(activeStep)) {
          setCompletedSteps((prev) => [...prev, activeStep]);
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      goToNextStep();
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, activeStep, goToNextStep, completedSteps]);

  const handleStepClick = (index: number) => {
    const newCompleted: number[] = [];
    for (let i = 0; i < index; i++) {
      newCompleted.push(i);
    }
    setCompletedSteps(newCompleted);
    setActiveStep(index);
  };

  const isCompleted = (index: number) => completedSteps.includes(index);

  return (
    <>
      <section
        id="for-individuals"
        className={clsx("w-full px-4 py-24", "sm:px-6 lg:px-8")}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:gap-10 lg:px-7 xl:gap-14 text-center">
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
            <Badge.Root
              variant="lighter"
              className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
            >
              <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
              {t("whyOmnis.badge")}
            </Badge.Root>
            <h2 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 mb-4 font-[550] lg:text-center">
              {t("whyOmnis.headline")}
            </h2>
            <p className="text-paragraph-md text-text-sub-600 lg:text-center">
              {t("whyOmnis.subheading")}{" "}
              <span className="text-label-md text-text-sub-600 lg:flex lg:justify-center">
                {t("whyOmnis.subheading_bold")}
              </span>
            </p>
          </div>

          <div
            ref={sectionRef}
            className="flex flex-row justify-center lg:gap-8 xl:gap-12"
          >
            <div className="flex flex-col gap-2 lg:max-w-xl lg:gap-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col gap-1">
                  <button
                    onClick={() => handleStepClick(index)}
                    className={`lg:rounded-20 flex cursor-pointer gap-4 rounded-[14px] border p-4 transition-all duration-300 lg:p-5 2xl:gap-6 2xl:p-6 ${
                      activeStep === index
                        ? "bg-bg-weak-50 border-transparent"
                        : "bg-bg-white-0 border-stroke-soft-200"
                    }`}
                  >
                    <span
                      className={`text-label-sm lg:text-label-md 2xl:text-label-lg transition duration-300 ${
                        activeStep === index
                          ? "text-information-base"
                          : isCompleted(index)
                            ? "text-text-soft-400"
                            : "text-text-disabled-300"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div className="flex flex-1 flex-col items-start gap-2">
                      <span
                        className={`text-label-sm lg:text-label-md 2xl:text-label-lg transition duration-300 ${
                          activeStep === index
                            ? "text-text-strong-950"
                            : isCompleted(index)
                              ? "text-text-strong-950"
                              : "text-text-soft-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      {activeStep === index && step.description && (
                        <p className="text-paragraph-sm 2xl:text-paragraph-md text-text-sub-600 animate-in fade-in slide-in-from-top-2 text-left duration-300">
                          {step.description}
                        </p>
                      )}
                    </div>
                    <div className="flex size-6 items-center justify-center">
                      {isCompleted(index) ? (
                        <CheckIcon />
                      ) : activeStep !== index ? (
                        <RiLoader2Line className="text-text-disabled-300 size-6 shrink-0 animate-spin" />
                      ) : null}
                    </div>
                  </button>

                  {activeStep === index && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 lg:hidden">
                      <img
                        src={step.image}
                        alt={step.title}
                        width={600}
                        height={400}
                        className="rounded-20 h-auto w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-bg-weak-50 relative hidden w-full shrink-0 overflow-hidden rounded-[36px] lg:flex lg:max-w-106 lg:min-w-[320px] xl:max-w-150 xl:min-w-150">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`absolute top-0 left-0 h-full w-full transition-all duration-500 ease-out ${
                    activeStep === index
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={600}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <DividerComp />
    </>
  );
}
