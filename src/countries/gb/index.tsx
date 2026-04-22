import type { CountryModule } from "@/countries/types";

/**
 * GB currently shares the same structure as the global site.
 * When GB needs its own pages, replace this with a dedicated module.
 */
const gbModule: CountryModule = {
  // Lazy-import global pages — same structure for now
  routes: [
    {
      index: true,
      async lazy() {
        const { default: Component } =
          await import("@/countries/global/pages/LandingPage");
        return { Component };
      },
    },
    {
      path: "checkout",
      async lazy() {
        const { default: Component } =
          await import("@/countries/global/pages/CheckoutPage");
        return { Component };
      },
    },
    {
      path: "contact",
      async lazy() {
        const { default: Component } =
          await import("@/countries/global/pages/ContactPage");
        return { Component };
      },
    },
    {
      path: "pricing",
      async lazy() {
        const { default: Component } =
          await import("@/countries/global/pages/PricingPage");
        return { Component };
      },
    },
  ],
};

export default gbModule;
