import { useTranslation } from "@/hooks/useTranslation";
import * as Badge from "@/components/ui/Badge";

/**
 * UAE Hero Section — placeholder scaffold.
 * Replace with the full UAE hero design when ready.
 */
export default function UAEHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Badge.Root
          variant="lighter"
          className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
        >
          <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
          {t("hero.tagline")}
        </Badge.Root>

        <h1 className="text-title-h2 lg:text-title-h1 text-text-strong-950 max-w-4xl font-[550]">
          {t("hero.headline")}
        </h1>

        <p className="text-paragraph-lg text-text-sub-600 mt-6 max-w-2xl">
          {t("hero.subheading")}
        </p>
      </div>
    </section>
  );
}
