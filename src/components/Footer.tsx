import {
  RiMailLine,
  RiFacebookCircleFill,
  RiInstagramFill,
  RiBehanceLine,
  RiTwitterXFill,
  RiDribbbleLine,
} from "@remixicon/react";
import * as Button from "@/components/ui/Button";
import * as Input from "@/components/ui/Input";
import * as Label from "@/components/ui/Label";
import * as LinkButton from "@/components/ui/LinkButton";
import { Link } from "react-router-dom";
import Omnis from "@/assets/OMNIS.svg";
import companyLogoDark from "@/assets/Brand Items [Atomic].svg";
import { useTranslation } from "@/hooks/useTranslation";
import Container from "./ui/Container";

export default function Footer02() {
  const { t } = useTranslation();

  const socialLinks = [
    {
      id: "facebook",
      icon: RiFacebookCircleFill,
      href: "#",
      label: "Facebook",
    },
    { id: "instagram", icon: RiInstagramFill, href: "#", label: "Instagram" },
    { id: "behance", icon: RiBehanceLine, href: "#", label: "Behance" },
    { id: "twitter", icon: RiTwitterXFill, href: "#", label: "X (Twitter)" },
    { id: "dribbble", icon: RiDribbbleLine, href: "#", label: "Dribbble" },
  ];

  const productLinks = [
    { id: "p1", key: "footer.product_overview" },
    { id: "p2", key: "footer.product_domestic" },
    { id: "p3", key: "footer.product_multicurrency" },
    { id: "p4", key: "footer.product_wallets" },
    { id: "p5", key: "footer.product_prepaid" },
  ];

  const bizLinks = [
    { id: "b1", key: "footer.biz_open_banking" },
    { id: "b2", key: "footer.biz_bulk_payouts" },
    { id: "b3", key: "footer.biz_vault" },
    { id: "b4", key: "footer.biz_cross_border" },
    { id: "b5", key: "footer.biz_payouts" },
  ];

  const personalLinks = [
    { id: "ps1", key: "footer.personal_open_banking" },
    { id: "ps2", key: "footer.personal_cross_border" },
    { id: "ps3", key: "footer.personal_domestic" },
  ];

  const aboutLinks = [
    { id: "a1", key: "footer.about_company" },
    { id: "a2", key: "footer.about_blog" },
    { id: "a3", key: "footer.about_careers" },
    { id: "a4", key: "footer.about_contact" },
  ];

  const bottomLegalLinks = [
    { id: "c1", key: "footer.cookie_preferences" },
    { id: "c2", key: "footer.privacy_policy" },
    { id: "c3", key: "footer.terms_of_service" },
  ];

  return (
    <footer className="w-full pt-10 md:pt-14">
      <Container>
        <div className="flex flex-col lg:flex-row lg:gap-10 2xl:gap-20 pb-6 md:pb-10">
          {/* DESKTOP: Column 1 — Product */}
          <div className="hidden flex-col items-start lg:flex lg:min-w-40 xl:min-w-48">
            <div className="flex flex-col items-start gap-2.5">
              <h3 className="text-label-sm text-text-soft-400">
                {t("footer.product_title")}
              </h3>
              {productLinks.map((link) => (
                <LinkButton.Root
                  key={link.id}
                  className="text-text-strong-950 text-label-sm xl:text-label-md hover:text-text-strong-950/80 h-auto cursor-pointer whitespace-break-spaces"
                  asChild
                >
                  <Link to="#">{t(link.key)}</Link>
                </LinkButton.Root>
              ))}
            </div>
          </div>

          {/* DESKTOP: Column 2 — Business & Personal Solutions */}
          <div className="hidden flex-col items-start gap-8 lg:flex lg:min-w-40 xl:min-w-48 xl:gap-12">
            <div className="flex flex-col items-start gap-2.5">
              <h3 className="text-label-sm text-text-soft-400">
                {t("footer.biz_solutions_title")}
              </h3>
              {bizLinks.map((link) => (
                <LinkButton.Root
                  key={link.id}
                  className="text-text-strong-950 text-label-sm xl:text-label-md hover:text-text-strong-950/80 h-auto cursor-pointer whitespace-break-spaces"
                  asChild
                >
                  <Link to="#">{t(link.key)}</Link>
                </LinkButton.Root>
              ))}
            </div>
            <div className="flex flex-col items-start gap-2.5">
              <h3 className="text-label-sm text-text-soft-400">
                {t("footer.personal_solutions_title")}
              </h3>
              {personalLinks.map((link) => (
                <LinkButton.Root
                  key={link.id}
                  className="text-text-strong-950 text-label-sm xl:text-label-md hover:text-text-strong-950/80 h-auto cursor-pointer whitespace-break-spaces"
                  asChild
                >
                  <Link to="#">{t(link.key)}</Link>
                </LinkButton.Root>
              ))}
            </div>
          </div>

          {/* DESKTOP: Column 3 — About */}
          <div className="hidden flex-col items-start lg:flex lg:min-w-40 xl:min-w-48">
            <div className="flex flex-col items-start gap-2.5">
              <h3 className="text-label-sm text-text-soft-400">
                {t("footer.about_title")}
              </h3>
              {aboutLinks.map((link) => (
                <LinkButton.Root
                  key={link.id}
                  className="text-text-strong-950 text-label-sm xl:text-label-md hover:text-text-strong-950/80 h-auto cursor-pointer whitespace-break-spaces"
                  asChild
                >
                  <Link to="#">{t(link.key)}</Link>
                </LinkButton.Root>
              ))}
            </div>
          </div>

          {/* RIGHT — Newsletter + Social (always visible) */}
          <div className="mb-8 flex flex-1 flex-col items-start gap-8 lg:mb-0 xl:gap-12">
            <div className="flex w-full flex-col items-start gap-4 lg:w-auto xl:gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-label-md text-text-strong-950">
                  {t("footer.newsletter_title")}
                </div>
                <div className="text-text-sub-600 lg:text-text-soft-400 text-label-sm">
                  {t("footer.newsletter_desc")}
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label.Root
                    htmlFor="footer-email"
                    className="text-text-sub-600 text-label-sm"
                  >
                    {t("footer.newsletter_email_label")}
                  </Label.Root>
                  <Input.Root className="shadow-custom-input rounded-xl">
                    <Input.Wrapper>
                      <Input.Icon as={RiMailLine} />
                      <Input.Input
                        id="footer-email"
                        type="email"
                        placeholder={t("footer.newsletter_email_placeholder")}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
                <Button.Root
                  variant="primary"
                  mode="filled"
                  className="rounded-10 w-full cursor-pointer"
                >
                  {t("footer.newsletter_subscribe")}
                </Button.Root>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-label-sm text-text-soft-400">
                {t("footer.follow_us")}
              </h3>
              <div className="flex gap-4">
                {socialLinks.map(({ id, icon: Icon, href, label }) => (
                  <Link
                    key={id}
                    to={href}
                    aria-label={label}
                    className="group transition-colors"
                  >
                    <Icon className="size-6 text-gray-200 transition-colors group-hover:text-primary-base" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* MOBILE columns — hidden on desktop */}
          <div className="flex flex-col gap-8 lg:hidden">
            <div className="flex gap-6">
              <div className="flex w-full flex-col items-start gap-2.5">
                <h3 className="text-label-sm text-text-sub-600">
                  {t("footer.product_title")}
                </h3>
                {productLinks.map((link) => (
                  <LinkButton.Root
                    key={link.id}
                    className="text-text-soft-400 text-label-sm h-auto whitespace-break-spaces"
                    asChild
                  >
                    <Link to="#">{t(link.key)}</Link>
                  </LinkButton.Root>
                ))}
              </div>
              <div className="flex w-full flex-col items-start gap-2.5">
                <h3 className="text-label-sm text-text-sub-600">
                  {t("footer.about_title")}
                </h3>
                {aboutLinks.map((link) => (
                  <LinkButton.Root
                    key={link.id}
                    className="text-text-soft-400 text-label-sm h-auto whitespace-break-spaces"
                    asChild
                  >
                    <Link to="#">{t(link.key)}</Link>
                  </LinkButton.Root>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex w-full flex-col items-start gap-2.5">
                <h3 className="text-label-sm text-text-sub-600">
                  {t("footer.biz_solutions_title")}
                </h3>
                {bizLinks.map((link) => (
                  <LinkButton.Root
                    key={link.id}
                    className="text-text-soft-400 text-label-sm h-auto whitespace-break-spaces"
                    asChild
                  >
                    <Link to="#">{t(link.key)}</Link>
                  </LinkButton.Root>
                ))}
              </div>
              <div className="flex w-full flex-col items-start gap-2.5">
                <h3 className="text-label-sm text-text-sub-600">
                  {t("footer.personal_solutions_title")}
                </h3>
                {personalLinks.map((link) => (
                  <LinkButton.Root
                    key={link.id}
                    className="text-text-soft-400 text-label-sm h-auto whitespace-break-spaces"
                    asChild
                  >
                    <Link to="#">{t(link.key)}</Link>
                  </LinkButton.Root>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-gray-alpha-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t py-6 md:py-10">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-4 xl:gap-8">
            <Link to="/" className="flex items-center gap-1.5">
              <img src={companyLogoDark} alt="logo" />
            </Link>
            <div className="text-label-xs xl:text-label-sm text-text-sub-600">
              {t("footer.copyright")}
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 lg:justify-start lg:gap-4 xl:gap-8">
            {bottomLegalLinks.map((link) => (
              <LinkButton.Root
                key={link.id}
                className="text-label-xs text-text-sub-600 hover:text-text-strong-950/80 cursor-pointer"
                asChild
              >
                <Link to="#">{t(link.key)}</Link>
              </LinkButton.Root>
            ))}
          </div>
        </div>
        <div className="flex">
          <img
            src={Omnis}
            alt="logo"
            width={100}
            height={100}
            className="h-auto w-full"
          />
        </div>
      </Container>
    </footer>
  );
}
