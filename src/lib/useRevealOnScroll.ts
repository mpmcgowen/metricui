"use client";

import { useRef, useState, useEffect } from "react";
import { useMetricConfig } from "./MetricProvider";

/**
 * Hook that triggers a one-shot reveal animation when the element
 * enters the viewport. Returns a ref to attach and a `revealed` boolean.
 *
 * Respects:
 * - MetricProvider `animate` (false = instant)
 * - prefers-reduced-motion (instant)
 *
 * @param delay  Stagger delay in ms (default 0)
 * @param threshold  IntersectionObserver threshold (default 0.1)
 */
export function useRevealOnScroll(delay = 0, threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const config = useMetricConfig();

  // Skip animation if disabled
  const shouldAnimate = config.animate;

  useEffect(() => {
    if (!shouldAnimate) {
      setRevealed(true);
      return;
    }

    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    // Fallback for environments without IntersectionObserver (SSR, jsdom tests)
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply stagger delay then reveal
          if (delay > 0) {
            setTimeout(() => setRevealed(true), delay);
          } else {
            setRevealed(true);
          }
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldAnimate, delay, threshold]);

  return { ref, revealed };
}
