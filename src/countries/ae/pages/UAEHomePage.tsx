import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { useLocale } from "@/hooks/useLocale";
import HeroSection from "../sections/HeroSection";
import WhoWeAreSection from "../sections/WhoWeAreSection";
import ForBusinessesSection from "../sections/ForBusinessesSection";
import ForIndividualsSection from "../sections/ForIndividualsSection";
import ForSolutionsSection from "../sections/ForSolutionsSection";
import ValueAddedFeaturesSection from "../sections/ValueAddedFeaturesSection";
import ForFinanceSection from "../sections/ForFinanceSection";
import FaqSection from "../sections/FaqSection";
import CookieConsent from "@/components/CookieConsent";
import LocationPopup from "@/components/LocationPopup";
import AIChatButton from "@/components/AIChatButton";
import WhyOmnisSection from "../sections/WhyOmnisSection";

export default function UAEHomePage() {
  const { isRTL } = useLocale();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
      return true;
    };
    if (!scroll()) {
      const raf = requestAnimationFrame(() => scroll());
      return () => cancelAnimationFrame(raf);
    }
  }, [hash]);

  return (
    <div className={clsx("w-full", isRTL && "text-right")}>
      <HeroSection />
      <WhoWeAreSection />
      <div id="products">
        <ForBusinessesSection />
      </div>
      <ForIndividualsSection />
      <WhyOmnisSection />
      <div id="solutions">
        <ForSolutionsSection />
      </div>
      <ValueAddedFeaturesSection />
      <ForFinanceSection />
      <div id="faq">
        <FaqSection />
      </div>

      {/* Floating widgets */}
      <AIChatButton />
      <CookieConsent />
      <LocationPopup />
    </div>
  );
}
