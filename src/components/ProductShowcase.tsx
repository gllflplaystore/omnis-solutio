import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import * as Badge from "@/components/ui/Badge";
import { clsx } from "clsx";
import Container from "./ui/Container";
import { Link } from "react-router-dom";

export interface ShowcaseFeature {
  icon: ReactNode;
  iconColor: string;
  title: string;
  desc: string;
}

interface ProductShowcaseProps {
  id: string;
  imagePosition?: "left" | "right";
  tagIcon: ReactNode;
  tag: string;
  headline: string;
  description: string;
  features: ShowcaseFeature[];
  ctaHref: string;
  ctaLabel: string;
  image?: ReactNode;
  className?: string;
}

export default function ProductShowcase({
  id,
  imagePosition = "left",
  tagIcon,
  tag,
  headline,
  description,
  features,
  ctaHref,
  ctaLabel,
  image,
  className,
}: ProductShowcaseProps) {
  const imagePlaceholder = image ?? (
    <span className="text-8xl opacity-10">◈</span>
  );

  const imageSlot = (
    <div className="flex h-full items-center justify-center overflow-hidden">
      {imagePlaceholder}
    </div>
  );

  const contentSlot = (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        {/* Badge */}
        <Badge.Root
          variant="lighter"
          color="gray"
          size="medium"
          className="tracking-widest uppercase ring-0 px-4 py-1.5 h-auto max-w-max"
        >
          {tagIcon}
          {tag}
        </Badge.Root>

        {/* Headline */}
        <h2 className="text-title-h5 lg:text-title-h3 xl:text-title-h2 text-text-strong-950 font-semibold">
          {headline}
        </h2>

        {/* Description */}
        <p className="md:max-w-xl text-label-sm md:text-label-md text-text-soft-400">
          {description}
        </p>

        {/* Feature list */}
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="bg-bg-weak-50 rounded-full shadow-custom-input-4 flex size-10 shrink-0 items-center justify-center lg:size-12">
              <span
                className={`flex items-center justify-center size-6 lg:size-7 ${f.iconColor}`}
              >
                {f.icon}
              </span>
            </div>
            <div>
              <p className="text-label-md text-text-strong-950">{f.title}</p>
              <p className="mt-0.5 text-label-sm text-text-soft-400">
                {f.desc}
              </p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-4">
          <Link
            to={ctaHref}
            className="inline-flex h-11 items-center gap-2 rounded-xl px-6 text-label-sm font-semibold bg-primary-base text-white transition-opacity hover:opacity-90"
          >
            {ctaLabel}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <section id={id} className={clsx("", className)}>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {imagePosition === "left" ? (
            <>
              {imageSlot}
              {contentSlot}
            </>
          ) : (
            <>
              {contentSlot}
              {imageSlot}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
