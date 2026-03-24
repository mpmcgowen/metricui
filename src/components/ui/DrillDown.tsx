"use client";

import { type ReactNode } from "react";
import { DrillDownProvider, type DrillDownProviderProps } from "@/lib/DrillDownContext";
import { DrillDownOverlay, type DrillDownOverlayProps } from "./DrillDownPanel";

export { useDrillDown, type DrillDownTrigger, type DrillDownState, type DrillDownMode, type DrillDownContent } from "@/lib/DrillDownContext";
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
function DrillDownRoot({ children, maxDepth, renderContent }: DrillDownProviderProps & Pick<DrillDownOverlayProps, "renderContent">) {
  return (
    <DrillDownProvider maxDepth={maxDepth}>
      {children}
      <DrillDownOverlay renderContent={renderContent} />
    </DrillDownProvider>
  );
}

export const DrillDown = {
  Root: DrillDownRoot,
  Overlay: DrillDownOverlay,
};
