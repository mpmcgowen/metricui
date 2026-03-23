"use client";

import { useState, useEffect, useRef } from "react";
import { useMetricConfig } from "./MetricProvider";
import type { ValueFlashOptions } from "./interactionTypes";

/**
 * Detects data changes and returns a CSS class that triggers a brief
 * flash animation on the component's container.
 *
 * - Skips the first render (no flash on mount)
 * - Respects `prefers-reduced-motion`
 * - Respects `MetricConfig.animate`
 * - Uses JSON.stringify for deep comparison of arrays/objects
 *
 * @param deps - The value(s) to watch for changes (primitive, array, or object)
 * @param options - Optional duration and disabled flag
 * @returns CSS class name: `"mu-value-flash"` when flashing, `""` otherwise
 */
export function useValueFlash(deps: unknown, options?: ValueFlashOptions): string {
  const { duration = 600, disabled = false } = options ?? {};
  const config = useMetricConfig();

  const [flashing, setFlashing] = useState(false);
  const isFirstRender = useRef(true);
  const prevRef = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Serialize for deep comparison
  const serialized = typeof deps === "object" && deps !== null
    ? JSON.stringify(deps)
    : String(deps);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevRef.current = serialized;
      return;
    }

    // No change
    if (serialized === prevRef.current) return;
    prevRef.current = serialized;

    // Disabled or animations off
    if (disabled || !config.animate) return;

    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Trigger flash — use setTimeout(0) to escape React's commit cycle
    // and avoid infinite re-render loops with Nivo's TooltipWrapper useLayoutEffect.
    clearTimeout(timeoutRef.current);
    setTimeout(() => setFlashing(true), 0);
    timeoutRef.current = setTimeout(() => setFlashing(false), duration);

    return () => clearTimeout(timeoutRef.current);
  }, [serialized, disabled, config.animate, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return flashing ? "mu-value-flash" : "";
}
