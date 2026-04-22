import DividerComp from "@/components/DividerComp";
import * as Badge from "@/components/ui/Badge";
import * as Input from "@/components/ui/Input";
import * as Label from "@/components/ui/Label";
import * as Select from "@/components/ui/Select";
import * as Textarea from "@/components/ui/Textarea";
import * as Checkbox from "@/components/ui/Checkbox";
import * as FancyButton from "@/components/ui/FancyButton";
import contactImage from "@/assets/contactImage.svg";
import {
  type RemixiconComponentType,
  RiMailFill,
  RiMap2Fill,
  RiCustomerService2Fill,
  RiInformationFill,
} from "@remixicon/react";
import React from "react";
import { Link } from "react-router-dom";
import PhoneInput from "@/components/ui/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";

type ContactCard = {
  id: string;
  icon: RemixiconComponentType;
  title: string;
  desc: string;
  value: string;
};

const countries = [
  {
    code: "UAE",
    label: "+971",
    icon: "/flags/United%20Arab%20Emirates.svg",
  },
  { code: "INR", label: "+91", icon: "/flags/India.svg" },
  { code: "GB", label: "+44", icon: "/flags/United%20Kingdom.svg" },
];

export default function ContactPage() {
  const uniqueId = React.useId();
  const { t } = useTranslation();

  const cardsConfig: ContactCard[] = [
    {
      id: "email",
      icon: RiMailFill,
      title: t("contact.card_email_title"),
      desc: t("contact.card_email_desc"),
      value: t("contact.card_email_value"),
    },
    {
      id: "address",
      icon: RiMap2Fill,
      title: t("contact.card_address_title"),
      desc: t("contact.card_address_desc"),
      value: t("contact.card_address_value"),
    },
    {
      id: "phone",
      icon: RiCustomerService2Fill,
      title: t("contact.card_phone_title"),
      desc: t("contact.card_phone_desc"),
      value: t("contact.card_phone_value"),
    },
  ];

  const businessTypes = [
    { value: "startup", label: t("contact.business_type_startup") },
    { value: "sme", label: t("contact.business_type_sme") },
    { value: "enterprise", label: t("contact.business_type_enterprise") },
    { value: "freelancer", label: t("contact.business_type_freelancer") },
  ];

  const volumeOptions = [
    { value: "0-10k", label: t("contact.volume_0_10k") },
    { value: "10k-50k", label: t("contact.volume_10k_50k") },
    { value: "50k-100k", label: t("contact.volume_50k_100k") },
    { value: "100k+", label: t("contact.volume_100k_plus") },
  ];

  const businessLocations = [
    { value: "ae", label: t("contact.location_ae") },
    { value: "gb", label: t("contact.location_gb") },
    { value: "us", label: t("contact.location_us") },
    { value: "other", label: t("contact.location_other") },
  ];

  return (
    <section id="for-businesses" className="w-full my-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
        {/* Badge */}
        <Badge.Root
          variant="lighter"
          className="bg-bg-weak-50 text-text-sub-600 text-label-sm mb-4 h-7 w-fit rounded-[9px] px-2.5 normal-case"
        >
          <Badge.Dot className="text-(--color-primary-base) mx-0 size-4 before:size-1.5" />
          {t("contact.badge")}
        </Badge.Root>
        <h2 className="text-title-h4 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 mb-4 font-[550] lg:text-center">
          {t("contact.headline")}
        </h2>
        <p className="text-paragraph-md text-text-sub-600 lg:text-center">
          {t("contact.subheading")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 mt-10 mb-24">
        {cardsConfig.map((card) => (
          <div
            key={card.id}
            className="flex flex-col p-8 gap-6 bg-bg-weak-50 rounded-[28px]"
          >
            <div className="size-12 shadow-custom-input-4 rounded-full flex items-center justify-center shrink-0 bg-bg-white-0">
              <card.icon className="size-6 text-warning-base" />
            </div>
            <div className="flex flex-col gap-1">
              <h5 className="text-label-lg text-text-strong-950">
                {card.title}
              </h5>
              <p className="text-paragraph-sm text-text-sub-600">{card.desc}</p>
            </div>
            <p className="text-label-md text-text-sub-600">{card.value}</p>
          </div>
        ))}
      </div>
      <DividerComp />
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-20 mt-16">
        {/* Left image */}
        <div className="hidden lg:block w-125 shrink-0">
          <img src={contactImage} alt={t("contact.badge")} />
        </div>

        {/* Right form */}
        <div className="relative z-2 flex w-full flex-col items-center">
          <form
            action=""
            className="bg-bg-white-0 shadow-complex-8 ring-1 ring-stroke-soft-200 relative z-2 mb-8 flex h-auto w-full flex-col gap-4 rounded-3xl p-6 lg:rounded-4xl lg:p-8"
          >
            {/* Row 1: Full name + Work email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="full-name"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_full_name")}
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root className="h-10 rounded-xl">
                  <Input.Wrapper>
                    <Input.Input
                      id="full-name"
                      type="text"
                      placeholder="Placeholder text..."
                      className="text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 placeholder:text-paragraph-sm"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="work-email"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_work_email")}
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root className="h-10 rounded-xl">
                  <Input.Wrapper>
                    <Input.Input
                      id="work-email"
                      type="email"
                      placeholder="hello@alignui.com"
                      className="text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 placeholder:text-paragraph-sm"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Row 2: Job title + Company name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="job-title"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_job_title")}
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root className="h-10 rounded-xl">
                  <Input.Wrapper>
                    <Input.Input
                      id="job-title"
                      type="text"
                      placeholder="hello@alignui.com"
                      className="text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 placeholder:text-paragraph-sm"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="company-name"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_company_name")}
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root className="h-10 rounded-xl">
                  <Input.Wrapper>
                    <Input.Input
                      id="company-name"
                      type="text"
                      placeholder="Placeholder text..."
                      className="text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 placeholder:text-paragraph-sm"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Row 3: Phone number + Business location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="phone-number"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_phone_number")}
                  <Label.Asterisk />
                </Label.Root>
                <PhoneInput
                  selectPosition="start"
                  id="businessPhoneNo"
                  name="businessPhoneNo"
                  countries={countries}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="business-location"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_business_location")}
                  <Label.Asterisk />
                </Label.Root>
                <Select.Root defaultValue="ae">
                  <Select.Trigger className="text-paragraph-sm text-text-strong-950 data-placeholder:text-text-soft-400 h-10 rounded-xl">
                    <Select.Value
                      placeholder={t("contact.select_placeholder")}
                    />
                  </Select.Trigger>
                  <Select.Content>
                    {businessLocations.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            {/* Row 4: Type of business + Expected monthly volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="business-type"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_business_type")}
                  <Label.Asterisk />
                </Label.Root>
                <Select.Root>
                  <Select.Trigger className="text-paragraph-sm text-text-sub-600 data-placeholder:text-text-soft-400 h-10 rounded-xl">
                    <Select.Value
                      placeholder={t("contact.select_placeholder")}
                    />
                  </Select.Trigger>
                  <Select.Content>
                    {businessTypes.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root
                  htmlFor="monthly-volume"
                  className="text-label-sm text-text-sub-600"
                >
                  {t("contact.form_monthly_volume")}
                  <Label.Asterisk />
                </Label.Root>
                <Select.Root>
                  <Select.Trigger className="text-paragraph-sm text-text-sub-600 data-placeholder:text-text-soft-400 h-10 rounded-xl">
                    <Select.Value
                      placeholder={t("contact.select_placeholder")}
                    />
                  </Select.Trigger>
                  <Select.Content>
                    {volumeOptions.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            {/* Row 5: How can we help you */}
            <div className="flex flex-col gap-1.5">
              <Label.Root
                htmlFor="message"
                className="text-label-sm text-text-sub-600"
              >
                {t("contact.form_help")}
                <Label.Asterisk />
                <Label.Sub className="ml-0.5">
                  {t("contact.form_optional")}
                </Label.Sub>
                <RiInformationFill className="ml-1 size-4 text-text-disabled-300" />
              </Label.Root>
              <Textarea.Root
                id="message"
                placeholder={t("contact.form_help_placeholder")}
                className="text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 placeholder:text-paragraph-sm"
                containerClassName="rounded-[14px]"
              >
                <Textarea.CharCounter current={0} max={200} />
              </Textarea.Root>
            </div>

            {/* Checkbox */}
            <div className="my-2 flex items-center gap-3">
              <Checkbox.Root id={`${uniqueId}-c1`} className="size-5" checked />
              <Label.Root
                className="text-paragraph-sm text-text-sub-600 flex flex-wrap gap-0.5"
                htmlFor={`${uniqueId}-c1`}
              >
                {t("contact.form_accept_prefix")}{" "}
                <Link
                  to="/privacy-policy"
                  className="text-paragraph-sm text-text-sub-600 mx-0.5 underline underline-offset-3"
                >
                  {t("contact.form_privacy")}{" "}
                </Link>{" "}
                {t("contact.form_accept_join")}{" "}
                <Link
                  to="/terms-of-service"
                  className="text-text-sub-600 text-paragraph-sm mx-0.5 underline underline-offset-3"
                >
                  {" "}
                  {t("contact.form_terms")}
                </Link>
              </Label.Root>
            </div>

            {/* Submit */}
            <div className="flex w-full">
              <FancyButton.Root
                variant="primary"
                size="medium"
                className="w-full cursor-pointer rounded-xl"
              >
                {t("contact.form_submit")}
              </FancyButton.Root>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
