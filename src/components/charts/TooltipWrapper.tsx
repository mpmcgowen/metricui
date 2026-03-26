"use client";

import { useRef, useLayoutEffect } from "react";

/**
 * Viewport-aware tooltip wrapper.
 *
 * Nudges tooltip content back into the viewport if it overflows any edge.
 * Uses direct DOM mutation (no setState) to avoid render loops
 * with Nivo's useLayoutEffect-based tooltip positioning.
 *
 * Also checks if the tooltip is clipped by its nearest overflow:hidden
 * ancestor (the chart container) and nudges accordingly.
 */
export function TooltipWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 12;

    let dx = 0;
    let dy = 0;

    // Find the nearest overflow-hidden ancestor (chart container)
    let container = el.parentElement;
    while (container && container !== document.body) {
      const overflow = getComputedStyle(container).overflow;
      if (overflow === "hidden" || overflow === "clip") break;
      container = container.parentElement;
    }

    if (container && container !== document.body) {
      const containerRect = container.getBoundingClientRect();

      // Nudge if tooltip extends beyond the container
      if (rect.left < containerRect.left + pad) {
        dx = containerRect.left + pad - rect.left;
      }
      if (rect.right > containerRect.right - pad) {
        dx = containerRect.right - pad - rect.right;
      }
      if (rect.top < containerRect.top + pad) {
        dy = containerRect.top + pad - rect.top;
      }
      if (rect.bottom > containerRect.bottom - pad) {
        dy = containerRect.bottom - pad - rect.bottom;
      }
    }

    // Also clamp to viewport edges
    const nudgedLeft = rect.left + dx;
    const nudgedRight = rect.right + dx;
    const nudgedTop = rect.top + dy;
    const nudgedBottom = rect.bottom + dy;

    if (nudgedRight > vw - pad) dx -= nudgedRight - (vw - pad);
    if (nudgedLeft < pad) dx += pad - nudgedLeft;
    if (nudgedBottom > vh - pad) dy -= nudgedBottom - (vh - pad);
    if (nudgedTop < pad) dy += pad - nudgedTop;

    el.style.transform = dx || dy ? `translate(${dx}px, ${dy}px)` : "";
  });

  return (
    <div ref={ref} style={{ pointerEvents: "none" }}>
      {children}
    </div>
  );
}
