import "@/i18n"; // must be first — initialises i18next before React renders
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./styles/global.css";
import "./styles/App.css";
import "./styles/navbar.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
