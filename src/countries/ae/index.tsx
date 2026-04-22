import type { CountryModule } from "@/countries/types";

/**
 * UAE country module.
 *
 * Uses React Router's `lazy()` for code-splitting — UAE page chunks
 * are only downloaded when a user navigates to /ae/:lang/*.
 */
const aeModule: CountryModule = {
  routes: [
    {
      index: true,
      async lazy() {
        const { default: Component } =
          await import("@/countries/ae/pages/UAEHomePage");
        return { Component };
      },
    },
    {
      path: "products/domestic-account",
      async lazy() {
        const { default: Component } =
          await import("@/countries/ae/pages/UAEDomesticAccountPage");
        return { Component };
      },
    },
    {
      path: "products/multi-currency",
      async lazy() {
        const { default: Component } =
          await import("@/countries/ae/pages/UAEMultiCurrencyPage");
        return { Component };
      },
    },
    {
      path: "solutions",
      async lazy() {
        const { default: Component } =
          await import("@/countries/ae/pages/UAESolutionsPage");
        return { Component };
      },
    },
  ],
};

export default aeModule;
