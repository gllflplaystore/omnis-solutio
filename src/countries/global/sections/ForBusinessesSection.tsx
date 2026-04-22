import { useTranslation } from "@/hooks/useTranslation";
import {
  BarChart2,
  Bell,
  Clock,
  Landmark,
  Layers,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from "@/constants/locales";
import ProductShowcase from "@/components/ProductShowcase";
import WhiteLabel from "@/assets/white-label-solution.svg";
import * as Badge from "@/components/ui/Badge";
import DividerComp from "@/components/DividerComp";
import CurrencyCircle from "@/components/CurrencyCircle";
import Container from "@/components/ui/Container";
import BankFill from "@/assets/icons/bank-fill.svg";
import TimeFill from "@/assets/icons/time-fill.svg";
import FileWarningFill from "@/assets/icons/file-warning-fill.svg";

export default function ForBusinessesSection() {
  const { t } = useTranslation();
  const { country, language } = useLocale();

  const base =
    country === DEFAULT_COUNTRY && language === DEFAULT_LANGUAGE
      ? ""
      : `/${country}/${language}`;
  const link = `${base}/contact`;

  return (
    <>
      <section id="for-businesses" className="w-full py-10 md:py-14">
        <Container>
          <div className="mx-auto max-w-xl flex flex-col items-center text-center gap-4">
            {/* Badge */}
            <Badge.Root
              variant="light"
              color="orange"
              size="medium"
              className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto"
            >
              <Badge.Dot className="animate-pulse" />
              {t("forBusinesses.badge")}
            </Badge.Root>

            <h2 className="text-title-h5 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-semibold lg:text-center">
              {t("forBusinesses.headline")}
            </h2>
            <p className="text-label-sm md:text-label-md text-text-sub-600 lg:text-center">
              {t("forBusinesses.subheading")}
            </p>
          </div>
        </Container>
      </section>

      {/* Domestic / Services — UAE only */}
      {country === "ae" && (
        <ProductShowcase
          id="services"
          imagePosition="left"
          tagIcon={<BarChart2 size={13} />}
          tag={t("domestic.tag")}
          headline={t("domestic.headline")}
          description={t("domestic.description")}
          features={[
            {
              icon: (
                <Landmark size={16} className="text-(--color-primary-base)" />
              ),
              iconColor: "text-blue-400",
              title: t("domestic.feature1_title"),
              desc: t("domestic.feature1_desc"),
            },
            {
              icon: <Clock size={16} className="text-green-500" />,
              iconColor: "text-green-500",
              title: t("domestic.feature2_title"),
              desc: t("domestic.feature2_desc"),
            },
            {
              icon: <Bell size={16} className="text-(--color-primary-base)" />,
              iconColor: "text-(--color-primary-base)",
              title: t("domestic.feature3_title"),
              desc: t("domestic.feature3_desc"),
            },
          ]}
          ctaHref={link}
          ctaLabel={t("domestic.cta")}
        />
      )}

      <ProductShowcase
        id="multi-currency"
        imagePosition="right"
        // image={<img src={MultiCurrency} alt="Multi Currency" />}
        image={<CurrencyCircle />}
        tagIcon={<BarChart2 size={13} />}
        tag={t("multiCurrency.tag")}
        headline={t("multiCurrency.headline")}
        description={t("multiCurrency.description")}
        className="py-10 md:py-14"
        features={[
          {
            icon: <img src={BankFill} alt="Bank Fill" />,
            iconColor: "text-blue-400",
            title: t("multiCurrency.feature1_title"),
            desc: t("multiCurrency.feature1_desc"),
          },
          {
            icon: <img src={TimeFill} alt="Time Fill" />,
            iconColor: "text-green-500",
            title: t("multiCurrency.feature2_title"),
            desc: t("multiCurrency.feature2_desc"),
          },
          {
            icon: <img src={FileWarningFill} alt="File Warning Fill" />,
            iconColor: "text-(--color-primary-base)",
            title: t("multiCurrency.feature3_title"),
            desc: t("multiCurrency.feature3_desc"),
          },
        ]}
        ctaHref={link}
        ctaLabel={t("multiCurrency.cta")}
      />

      <ProductShowcase
        id="white-label"
        imagePosition="left"
        image={
          <img src={WhiteLabel} alt="White Label" className="w-full h-full" />
        }
        tagIcon={<Layers size={13} />}
        tag={t("whiteLabel.tag")}
        headline={t("whiteLabel.headline")}
        description={t("whiteLabel.description")}
        className="py-10 md:py-14"
        features={[
          {
            icon: <img src={BankFill} alt="Bank Fill" />,
            iconColor: "text-blue-400",
            title: t("whiteLabel.feature1_title"),
            desc: t("whiteLabel.feature1_desc"),
          },
          {
            icon: <img src={TimeFill} alt="Time Fill" />,
            iconColor: "text-green-500",
            title: t("whiteLabel.feature2_title"),
            desc: t("whiteLabel.feature2_desc"),
          },
          {
            icon: <img src={FileWarningFill} alt="File Warning Fill" />,
            iconColor: "text-(--color-primary-base)",
            title: t("whiteLabel.feature3_title"),
            desc: t("whiteLabel.feature3_desc"),
          },
        ]}
        ctaHref={link}
        ctaLabel={t("whiteLabel.cta")}
      />

      <DividerComp />
    </>
  );
}
