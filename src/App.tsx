import { RouterProvider } from "react-router-dom";
import { buildRouter } from "@/countries/registry";

const router = buildRouter();

export default function App() {
  return <RouterProvider router={router} />;
}
