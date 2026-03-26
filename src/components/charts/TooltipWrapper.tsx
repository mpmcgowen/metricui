"use client";

import { useRef, useLayoutEffect } from "react";

/**
 * Viewport-aware tooltip wrapper.
 *
 * Nudges tooltip content back into the viewport if it overflows any edge.
 * Uses direct DOM mutation (no setState) to avoid render loops
 * with Nivo's useLayoutEffect-based tooltip positioning.
 */
export function TooltipWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prevDx = useRef(0);
  const prevDy = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read current rect (includes any previous transform)
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 12;

    // Compute natural position by removing previous nudge
    const naturalLeft = rect.left - prevDx.current;
    const naturalRight = rect.right - prevDx.current;
    const naturalTop = rect.top - prevDy.current;
    const naturalBottom = rect.bottom - prevDy.current;

    let dx = 0;
    let dy = 0;

    // Right edge
    if (naturalRight > vw - pad) dx = vw - pad - naturalRight;
    // Left edge (after right nudge)
    if (naturalLeft + dx < pad) dx = pad - naturalLeft;
    // Bottom edge
    if (naturalBottom > vh - pad) dy = vh - pad - naturalBottom;
    // Top edge (after bottom nudge)
    if (naturalTop + dy < pad) dy = pad - naturalTop;

    // Only update if changed (prevents oscillation)
    if (Math.abs(dx - prevDx.current) > 0.5 || Math.abs(dy - prevDy.current) > 0.5) {
      prevDx.current = dx;
      prevDy.current = dy;
      el.style.transform = dx || dy ? `translate(${dx}px, ${dy}px)` : "";
    }
  });

  return (
    <div ref={ref} style={{ pointerEvents: "none" }}>
      {children}
    </div>
  );
}
