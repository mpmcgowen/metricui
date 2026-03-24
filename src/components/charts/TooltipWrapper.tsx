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
  const nudgeRef = useRef({ x: 0, y: 0 });
  const [nudge, setNudge] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 8;

    // Compute the natural (untransformed) rect by subtracting current nudge
    const naturalRight = rect.right - nudgeRef.current.x;
    const naturalLeft = rect.left - nudgeRef.current.x;
    const naturalBottom = rect.bottom - nudgeRef.current.y;
    const naturalTop = rect.top - nudgeRef.current.y;

    let dx = 0;
    let dy = 0;

    if (naturalRight > vw - pad) dx = vw - pad - naturalRight;
    if (naturalLeft + dx < pad) dx = pad - naturalLeft;
    if (naturalBottom > vh - pad) dy = vh - pad - naturalBottom;
    if (naturalTop + dy < pad) dy = pad - naturalTop;

    if (dx !== nudgeRef.current.x || dy !== nudgeRef.current.y) {
      nudgeRef.current = { x: dx, y: dy };
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
