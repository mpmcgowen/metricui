"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionHeaderProps {
  /** Section title — rendered uppercase, tracked, accent-colored */
  title: string;
  /** Subtitle — rendered below title in muted text */
  subtitle?: string;
  /** Description — renders as a "?" popover next to the title */
  description?: string | React.ReactNode;
  /** Action slot — rendered right-aligned. Buttons, links, toggles. */
  action?: React.ReactNode;
  /** Badge or status indicator — rendered inline after the title */
  badge?: React.ReactNode;
  /** Bottom border for visual separation. Default: false */
  border?: boolean;
  /** Top margin. Default: true (adds spacing above). Set false when you control spacing externally. */
  spacing?: boolean;
  /** Dense mode */
  dense?: boolean;
  /** Additional class names */
  className?: string;
  /** Sub-element class overrides */
  classNames?: {
    root?: string;
    title?: string;
    subtitle?: string;
    action?: string;
  };
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader(
    {
      title,
      subtitle,
      description,
      action,
      badge,
      border = false,
      spacing = true,
      dense: denseProp,
      className,
      classNames,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const resolvedDense = denseProp ?? config.dense;

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn(
          "flex items-end justify-between",
          spacing && (resolvedDense ? "mt-4" : "mt-8"),
          border && "border-b border-[var(--card-border)] pb-3",
          className,
          classNames?.root,
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "font-semibold uppercase tracking-widest text-[var(--accent)]",
                resolvedDense ? "text-[9px]" : "text-[10px]",
                classNames?.title,
              )}
            >
              {title}
            </p>
            {description && (
              <DescriptionPopover content={description} />
            )}
            {badge && (
              <span className="flex-shrink-0">{badge}</span>
            )}
          </div>
          {subtitle && (
            <p
              className={cn(
                "mt-0.5 text-[var(--muted)]",
                resolvedDense ? "text-xs" : "text-sm",
                classNames?.subtitle,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className={cn("flex-shrink-0", classNames?.action)}>
            {action}
          </div>
        )}
      </div>
    );
  },
);
