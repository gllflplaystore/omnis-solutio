import { Outlet } from "react-router-dom";
import LocaleEffects from "@/components/LocaleEffects";
import I18nSync from "@/i18n/I18nSync";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteScrollTop from "@/components/RouteScrollTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Layout() {
  return (
    <>
      <LocaleEffects />
      <I18nSync />
      <RouteScrollTop />
      <div className="flex min-h-screen flex-col bg-(--color-bg-white-0)">
        {/* Side lines decoration — spans entire app */}
        <div className="side-lines pointer-events-none fixed inset-0 hidden lg:block">
          <div className="side-line left" />
          <div className="side-line right" />
        </div>
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
}
