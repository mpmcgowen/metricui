"use client";

import { useRef, useLayoutEffect, useState } from "react";

/**
 * Viewport-aware tooltip wrapper.
 *
 * Wraps any tooltip content and nudges it back into the viewport
 * if it would overflow the right or bottom edge. Works with Nivo's
 * default tooltip positioning (absolute inside the chart container).
 */
export function TooltipWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nudge, setNudge] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 8; // minimum gap from viewport edge

    let dx = 0;
    let dy = 0;

    // Right edge overflow
    if (rect.right > vw - pad) {
      dx = vw - pad - rect.right;
    }
    // Left edge overflow
    if (rect.left + dx < pad) {
      dx = pad - rect.left;
    }
    // Bottom edge overflow
    if (rect.bottom > vh - pad) {
      dy = vh - pad - rect.bottom;
    }
    // Top edge overflow
    if (rect.top + dy < pad) {
      dy = pad - rect.top;
    }

    if (dx !== nudge.x || dy !== nudge.y) {
      setNudge({ x: dx, y: dy });
    }
  });

  return (
    <div
      ref={ref}
      style={{
        transform: nudge.x || nudge.y ? `translate(${nudge.x}px, ${nudge.y}px)` : undefined,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
