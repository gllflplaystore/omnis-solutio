import { useTranslation } from "@/hooks/useTranslation";
import * as Badge from "@/components/ui/Badge";

/**
 * UAE Services Section — placeholder scaffold.
 * Replace with the full UAE services design when ready.
 */
export default function UAEServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Badge.Root
          variant="lighter"
          className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
        >
          <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
          {t("products.badge")}
        </Badge.Root>

        <h2 className="text-title-h3 lg:text-title-h2 text-text-strong-950 max-w-3xl font-[550]">
          {t("products.headline")}
        </h2>

        <p className="text-paragraph-md text-text-sub-600 mt-4 max-w-2xl">
          {t("products.desc")}
        </p>
      </div>
    </section>
  );
}
