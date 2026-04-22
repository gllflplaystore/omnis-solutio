import {
  type RouteObject,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import type { CountryModule } from "@/countries/types";
import type { CountryCode } from "@/constants/locales";
import Layout from "@/components/Layout";
import LocaleGuard from "@/routes/LocaleGuard";

// ── Country modules ──────────────────────────────────────────────────────────
import globalModule from "@/countries/global";
import gbModule from "@/countries/gb";
import aeModule from "@/countries/ae";

/**
 * Registry mapping each supported country code to its module.
 * Adding a new country? Import its module above and add an entry here.
 */
const registry: Record<CountryCode, CountryModule> = {
  global: globalModule,
  ae: aeModule,
  gb: gbModule,
};

// ── Router builder ───────────────────────────────────────────────────────────

function wrapWithLayout(countryCode: CountryCode): React.ReactElement {
  return (
    <LocaleGuard country={countryCode}>
      <Layout />
    </LocaleGuard>
  );
}

/**
 * Builds the full application router from the country registry.
 *
 * Route structure:
 *   /                     → global module routes
 *   /ae/:lang             → UAE module routes
 *   /gb/:lang             → GB module routes
 *   *                     → redirect to /
 */
export function buildRouter() {
  const routes: RouteObject[] = [];

  for (const [countryCode, mod] of Object.entries(registry)) {
    const cc = countryCode as CountryCode;
    if (countryCode === "global") {
      // Global site lives at the root `/` and also at `/global/:lang`
      routes.push(
        {
          path: "/",
          element: wrapWithLayout(cc),
          children: mod.routes,
        },
        {
          path: "/global/:lang",
          element: wrapWithLayout(cc),
          children: mod.routes,
        },
      );
    } else {
      // Country-specific sites: /:country/:lang
      routes.push({
        path: `/${countryCode}/:lang`,
        element: wrapWithLayout(cc),
        children: mod.routes,
      });
    }
  }

  // Catch-all
  routes.push({
    path: "*",
    element: <Navigate to="/" replace />,
  });

  return createBrowserRouter(routes);
}

export { registry };
