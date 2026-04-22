import type { RouteObject } from "react-router-dom";

/**
 * Every country module must export an object conforming to this interface.
 * The `routes` array is used as children inside the Layout for that country.
 */
export interface CountryModule {
  /** Route children rendered inside <Layout /> for this country. */
  routes: RouteObject[];
}
