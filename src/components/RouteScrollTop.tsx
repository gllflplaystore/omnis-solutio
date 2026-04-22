import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type ScrollTrigger = "pathname" | "pathname+search" | "all";

interface RouteScrollTopProps {
  behavior?: ScrollBehavior;
  trigger?: ScrollTrigger;
  top?: number;
  left?: number;
  durationMs?: number;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Reusable route-aware scroll reset.
 *
 * Usage:
 * - <RouteScrollTop />
 * - <RouteScrollTop behavior="smooth" trigger="pathname+search" />
 */
export default function RouteScrollTop({
  behavior = "smooth",
  trigger = "pathname",
  top = 0,
  left = 0,
  durationMs = 1200,
}: RouteScrollTopProps) {
  const { pathname, search, hash } = useLocation();

  const dependency =
    trigger === "pathname"
      ? pathname
      : trigger === "pathname+search"
        ? `${pathname}${search}`
        : `${pathname}${search}${hash}`;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (behavior === "auto" || prefersReducedMotion) {
      window.scrollTo({ top, left, behavior: "auto" });
      return;
    }

    const startX = window.scrollX;
    const startY = window.scrollY;
    const deltaX = left - startX;
    const deltaY = top - startY;

    if (deltaX === 0 && deltaY === 0) return;

    const safeDuration = Math.max(100, durationMs);
    const startTime = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / safeDuration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(startX + deltaX * eased, startY + deltaY * eased);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [dependency, top, left, behavior, durationMs]);

  return null;
}
