"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DividerProps {
  /** Label centered in the divider line */
  label?: string;
  /** Icon centered in the divider line (replaces label) */
  icon?: React.ReactNode;
  /** Orientation. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Line style. Default: "solid" */
  variant?: "solid" | "dashed" | "dotted";
  /** Vertical spacing around horizontal dividers / horizontal spacing around vertical dividers.
   *  Default: "md". "none" removes spacing entirely. */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Accent-colored line instead of muted. Default: false */
  accent?: boolean;
  /** Dense mode */
  dense?: boolean;
  /** Additional class names */
  className?: string;
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Spacing values
// ---------------------------------------------------------------------------

const H_SPACING = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-8",
};

const H_SPACING_DENSE = {
  none: "",
  sm: "my-1",
  md: "my-2",
  lg: "my-4",
};

const V_SPACING = {
  none: "",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-8",
};

const V_SPACING_DENSE = {
  none: "",
  sm: "mx-1",
  md: "mx-2",
  lg: "mx-4",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider(
    {
      label,
      icon,
      orientation = "horizontal",
      variant = "solid",
      spacing = "md",
      accent = false,
      dense: denseProp,
      className,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const resolvedDense = denseProp ?? config.dense;

    const lineColor = accent
      ? "border-[var(--accent)]/30"
      : "border-[var(--card-border)]";

    const lineStyle =
      variant === "dashed"
        ? "border-dashed"
        : variant === "dotted"
          ? "border-dotted"
          : "border-solid";

    const hasContent = !!(label || icon);

    // --- Vertical divider ---
    if (orientation === "vertical") {
      const vSpace = resolvedDense ? V_SPACING_DENSE[spacing] : V_SPACING[spacing];

      if (hasContent) {
        return (
          <div
            ref={ref}
            id={id}
            data-testid={dataTestId}
            role="separator"
            aria-orientation="vertical"
            className={cn(
              "inline-flex flex-col items-center self-stretch",
              vSpace,
              className,
            )}
          >
            <div className={cn("flex-1 border-l", lineColor, lineStyle)} />
            <span
              className={cn(
                "py-2 font-medium text-[var(--muted)]",
                resolvedDense ? "text-[9px]" : "text-[10px]",
                accent && "text-[var(--accent)]",
              )}
            >
              {icon ?? label}
            </span>
            <div className={cn("flex-1 border-l", lineColor, lineStyle)} />
          </div>
        );
      }

      return (
        <div
          ref={ref}
          id={id}
          data-testid={dataTestId}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "inline-flex self-stretch border-l",
            lineColor,
            lineStyle,
            vSpace,
            className,
          )}
        />
      );
    }

    // --- Horizontal divider ---
    const hSpace = resolvedDense ? H_SPACING_DENSE[spacing] : H_SPACING[spacing];

    if (hasContent) {
      return (
        <div
          ref={ref}
          id={id}
          data-testid={dataTestId}
          role="separator"
          aria-orientation="horizontal"
          className={cn(
            "flex items-center gap-3",
            hSpace,
            className,
          )}
        >
          <div className={cn("flex-1 border-t", lineColor, lineStyle)} />
          <span
            className={cn(
              "flex-shrink-0 font-medium uppercase tracking-widest text-[var(--muted)]",
              resolvedDense ? "text-[9px]" : "text-[10px]",
              accent && "text-[var(--accent)]",
            )}
          >
            {icon ?? label}
          </span>
          <div className={cn("flex-1 border-t", lineColor, lineStyle)} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          "border-t",
          lineColor,
          lineStyle,
          hSpace,
          className,
        )}
      />
    );
  },
);

// Grid hint — dividers are full-width in MetricGrid
(Divider as any).__gridHint = "full"; // eslint-disable-line @typescript-eslint/no-explicit-any
