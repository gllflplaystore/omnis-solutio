import * as Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import TickIcon from "@/assets/icons/TickIcon";
import DividerComp from "@/components/DividerComp";

type FeatureRow = {
  id: string;
  titleKey: string;
  descKey: string;
  bulletKeys: string[];
  imageOnLeft: boolean;
};

const featureRows: FeatureRow[] = [
  {
    id: "integration",
    titleKey: "daSetup.f1_title",
    descKey: "daSetup.f1_desc",
    bulletKeys: ["daSetup.f1_b1", "daSetup.f1_b2", "daSetup.f1_b3"],
    imageOnLeft: true,
  },
  {
    id: "dashboards",
    titleKey: "daSetup.f2_title",
    descKey: "daSetup.f2_desc",
    bulletKeys: ["daSetup.f2_b1", "daSetup.f2_b2", "daSetup.f2_b3"],
    imageOnLeft: false,
  },
  {
    id: "routing",
    titleKey: "daSetup.f3_title",
    descKey: "daSetup.f3_desc",
    bulletKeys: ["daSetup.f3_b1", "daSetup.f3_b2", "daSetup.f3_b3"],
    imageOnLeft: true,
  },
  {
    id: "analytics",
    titleKey: "daSetup.f4_title",
    descKey: "daSetup.f4_desc",
    bulletKeys: ["daSetup.f4_b1", "daSetup.f4_b2", "daSetup.f4_b3"],
    imageOnLeft: false,
  },
];

function DAFeatureSections() {
  const { t } = useTranslation();

  return (
    <>
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center gap-4 mb-16">
          <Badge.Root
            variant="lighter"
            className="bg-bg-weak-50 text-text-sub-600 text-label-sm h-7 w-fit rounded-[9px] px-2.5 normal-case"
          >
            <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
            {t("daSetup.tag")}
          </Badge.Root>

          <h2 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-[550] mt-2">
            {t("daSetup.headline")}
          </h2>

          <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
            {t("daSetup.subheading")}
          </p>
        </div>

        {/* Feature rows */}
        <div className="mx-auto max-w-7xl flex flex-col gap-14 lg:gap-20">
          {featureRows.map((row) => (
            <div
              key={row.id}
              className={`flex flex-col gap-8 items-center lg:gap-14 ${
                row.imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Image placeholder */}
              <div className="w-full lg:w-145 lg:shrink-0 h-65 sm:h-80 lg:h-100 bg-bg-weak-50 rounded-[28px] lg:rounded-[36px]" />

              {/* Content */}
              <div className="flex flex-col gap-8 flex-1 min-w-0">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-title-h4 lg:text-title-h3 text-text-strong-950 font-[550]">
                      {t(row.titleKey)}
                    </h3>
                    <p className="text-paragraph-md text-text-sub-600">
                      {t(row.descKey)}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-4">
                    {row.bulletKeys.map((key) => (
                      <li key={key} className="flex items-center gap-2.5">
                        <TickIcon className="size-3.75 text-success-base shrink-0" />
                        <span className="text-paragraph-md text-text-sub-600">
                          {t(key)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <DividerComp />
    </>
  );
}

export default DAFeatureSections;
