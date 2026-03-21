"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Shared ResizeObserver hook that tracks container width and height.
 *
 * Used by AreaChart, BarChart, DonutChart (width only), and Sparkline (width + height).
 */
export function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width, height };
}
