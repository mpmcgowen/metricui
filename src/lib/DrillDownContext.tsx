"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The context passed to a drill-down render function — what was clicked. */
export type DrillDownMode = "slide-over" | "modal";

export interface DrillDownTrigger {
  /** Field name (e.g., "country", "plan") */
  field?: string;
  /** The clicked value (e.g., "US", "Enterprise") */
  value?: string | number;
  /** Display label for the panel header */
  title: string;
  /** Presentation mode. Default: "slide-over". */
  mode?: DrillDownMode;
}

/** A single level in the drill stack. */
interface DrillLevel {
  trigger: DrillDownTrigger;
  content: ReactNode;
}

/** The drill-down context value. */
export interface DrillDownState {
  /** Current drill stack depth */
  depth: number;
  /** Open a new drill level */
  open: (trigger: DrillDownTrigger, content: ReactNode) => void;
  /** Go back one level */
  back: () => void;
  /** Close all drill levels */
  close: () => void;
  /** The full breadcrumb trail */
  breadcrumbs: DrillDownTrigger[];
  /** Navigate to a specific breadcrumb depth */
  goTo: (depth: number) => void;
  /** Whether any drill is open */
  isOpen: boolean;
  /** Current level's content */
  activeContent: ReactNode | null;
  /** Current level's trigger */
  activeTrigger: DrillDownTrigger | null;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DrillDownCtx = createContext<DrillDownState | null>(null);

/** Read the drill-down state. Returns null if no DrillDownProvider is present. */
export function useDrillDown(): DrillDownState | null {
  return useContext(DrillDownCtx);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface DrillDownProviderProps {
  children: ReactNode;
  /** Max nesting depth. Default: 4. */
  maxDepth?: number;
}

export function DrillDownProvider({ children, maxDepth = 4 }: DrillDownProviderProps) {
  const [stack, setStack] = useState<DrillLevel[]>([]);

  const open = useCallback((trigger: DrillDownTrigger, content: ReactNode) => {
    setStack((prev) => {
      if (prev.length >= maxDepth) {
        // Replace the top level instead of going deeper
        return [...prev.slice(0, -1), { trigger, content }];
      }
      return [...prev, { trigger, content }];
    });
  }, [maxDepth]);

  const back = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const close = useCallback(() => {
    setStack([]);
  }, []);

  const goTo = useCallback((depth: number) => {
    setStack((prev) => prev.slice(0, depth));
  }, []);

  // Escape key closes the top level
  useEffect(() => {
    if (stack.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        back();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [stack.length, back]);

  const value = useMemo<DrillDownState>(() => ({
    depth: stack.length,
    open,
    back,
    close,
    goTo,
    breadcrumbs: stack.map((s) => s.trigger),
    isOpen: stack.length > 0,
    activeContent: stack.length > 0 ? stack[stack.length - 1].content : null,
    activeTrigger: stack.length > 0 ? stack[stack.length - 1].trigger : null,
  }), [stack, open, back, close, goTo]);

  return (
    <DrillDownCtx.Provider value={value}>
      {children}
    </DrillDownCtx.Provider>
  );
}
