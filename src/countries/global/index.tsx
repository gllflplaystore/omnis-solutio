import type { CountryModule } from "@/countries/types";
import LandingPage from "@/countries/global/pages/LandingPage";
import CheckoutPage from "@/countries/global/pages/CheckoutPage";
import ContactPage from "@/countries/global/pages/ContactPage";
import PricingPage from "@/countries/global/pages/PricingPage";

const globalModule: CountryModule = {
  routes: [
    {
      index: true,
      element: <LandingPage />,
    },
    {
      path: "checkout",
      element: <CheckoutPage />,
    },
    {
      path: "contact",
      element: <ContactPage />,
    },
    {
      path: "pricing",
      element: <PricingPage />,
    },
  ],
};

export default globalModule;
