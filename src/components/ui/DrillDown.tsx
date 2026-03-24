"use client";

import { type ReactNode } from "react";
import { DrillDownProvider, type DrillDownProviderProps } from "@/lib/DrillDownContext";
import { DrillDownOverlay } from "./DrillDownPanel";

export { useDrillDown, type DrillDownTrigger, type DrillDownState, type DrillDownMode } from "@/lib/DrillDownContext";
export { useDrillDownAction } from "./DrillDownPanel";

/**
 * Complete drill-down system — wraps your dashboard with the provider
 * and auto-renders the slide-over panel.
 *
 * @example
 * ```tsx
 * <DrillDown.Root>
 *   <Dashboard />
 * </DrillDown.Root>
 * ```
 */
function DrillDownRoot({ children, maxDepth }: DrillDownProviderProps) {
  return (
    <DrillDownProvider maxDepth={maxDepth}>
      {children}
      <DrillDownOverlay />
    </DrillDownProvider>
  );
}

export const DrillDown = {
  Root: DrillDownRoot,
  Overlay: DrillDownOverlay,
};
