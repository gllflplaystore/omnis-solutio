import { useState, useEffect } from "react";
import { LuArrowUp } from "react-icons/lu";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-20 right-6 z-9999 flex flex-col items-end gap-3">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-2xl backdrop-blur-md bg-primary-base/90 border border-primary-alpha-24 text-text-white shadow-2xl hover:bg-bg-white-0 hover:text-primary-base hover:border-primary-base transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow:
                "0 8px 24px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06) inset",
            }}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <LuArrowUp size={20} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </>
  );
}
