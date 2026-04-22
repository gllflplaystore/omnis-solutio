import { useTranslation } from "@/hooks/useTranslation";
import DividerComp from "@/components/DividerComp";
import * as StatusBadge from "@/components/ui/StatusBadge";
import { RiTimeFill, RiShieldCheckFill } from "@remixicon/react";

// Pulse™ brand logo placeholder — replace with real partner SVGs when available
function PulseLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <RiShieldCheckFill className="size-5 text-text-sub-600" />
      <span className="text-paragraph-md text-text-sub-600">
        Pulse<sup className="text-text-soft-400 text-[10px]">™</sup>
      </span>
    </div>
  );
}

function MCTrust() {
  const { t } = useTranslation();

  return (
    <>
      <section className="w-full my-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-9">
            <div className="flex flex-col gap-6">
              <h2 className="text-title-h5 text-text-strong-950 font-[550]">
                {t("trust.left_title")}
              </h2>
              <p className="text-paragraph-md text-text-sub-600">
                {t("trust.left_desc")}
              </p>
            </div>

            {/* Stat card */}
            <div className="border-stroke-soft-200 shadow-regular-xs relative flex flex-col justify-between gap-20 rounded-[36px] border bg-bg-white-0 p-10">
              {/* Left accent bar */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-px h-16 w-0.5 rounded-r bg-feature-base" />

              <div className="flex flex-col gap-6">
                <StatusBadge.Root
                  variant="light"
                  className="bg-feature-lighter text-feature-dark text-label-sm h-7 w-fit gap-1.5 rounded-[9px] px-2"
                >
                  <StatusBadge.Icon
                    as={RiTimeFill}
                    className="size-4 text-feature-dark mx-0"
                  />
                  {t("trust.left_badge")}
                </StatusBadge.Root>

                <div className="flex flex-col gap-2">
                  <span className="text-title-h1 text-text-strong-950 font-[550]">
                    {t("trust.left_stat")}
                  </span>
                  <span className="text-label-md text-text-sub-600">
                    {t("trust.left_stat_label")}
                  </span>
                </div>
              </div>

              <p className="text-paragraph-md text-text-soft-400">
                {t("trust.left_footer")}
                <span className="text-label-md text-text-soft-400">
                  {t("trust.left_footer_bold")}
                </span>
              </p>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px self-stretch bg-stroke-soft-200" />

          {/* Right column */}
          <div className="flex flex-1 flex-col gap-9">
            <div className="flex flex-col gap-6">
              <h2 className="text-title-h5 text-text-strong-950 font-[550]">
                {t("trust.right_title")}
              </h2>
              <p className="text-paragraph-md text-text-sub-600">
                {t("trust.right_desc")}
              </p>
            </div>

            {/* 4×2 brand logo grid */}
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="flex gap-1.5">
                  {[0, 1].map((col) => (
                    <div
                      key={col}
                      className="flex flex-1 h-20 items-center justify-center rounded-xl"
                    >
                      <PulseLogo />
                    </div>
                  ))}
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

export default MCTrust;
