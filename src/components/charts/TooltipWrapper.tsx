"use client";

import { useRef, useLayoutEffect } from "react";

/**
 * Viewport-aware tooltip wrapper.
 *
 * Nudges tooltip content back into the viewport if it overflows.
 * Uses direct DOM mutation (no setState) to avoid render loops
 * with Nivo's useLayoutEffect-based tooltip positioning.
 */
export function TooltipWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 8;

    let dx = 0;
    let dy = 0;

    if (rect.right > vw - pad) dx = vw - pad - rect.right;
    if (rect.left + dx < pad) dx = pad - rect.left;
    if (rect.bottom > vh - pad) dy = vh - pad - rect.bottom;
    if (rect.top + dy < pad) dy = pad - rect.top;

    el.style.transform = dx || dy ? `translate(${dx}px, ${dy}px)` : "";
  });

  return (
    <div ref={ref} style={{ pointerEvents: "none" }}>
      {children}
    </div>
  );
}
