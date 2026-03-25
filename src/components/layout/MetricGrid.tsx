"use client";

import React, { forwardRef, Children, isValidElement, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { useContainerSize } from "@/lib/useContainerSize";
import { useRevealOnScroll } from "@/lib/useRevealOnScroll";
import { SectionHeader } from "@/components/ui/SectionHeader";

// ---------------------------------------------------------------------------
// Layout hints — each MetricUI component declares its preferred grid behavior
// ---------------------------------------------------------------------------

export type GridHint = "kpi" | "chart" | "table" | "stat" | "gauge" | "header" | "full";

/** Attach to any component: MyComponent.__gridHint = "chart" */
export interface GridHintable {
  __gridHint?: GridHint;
}

// ---------------------------------------------------------------------------
// Item — explicit override wrapper (optional)
// ---------------------------------------------------------------------------

interface MetricGridItemProps {
  /** Column behavior: "sm" (1/4), "md" (1/3), "lg" (2/3), "full" (full width), or a number 1-12. */
  span?: "sm" | "md" | "lg" | "full" | number;
  children: React.ReactNode;
  className?: string;
}

function MetricGridItem({ children, className }: MetricGridItemProps) {
  return <div className={className}>{children}</div>;
}
MetricGridItem.displayName = "MetricGrid.Item";

// ---------------------------------------------------------------------------
// Section — full-width header that divides the grid into labeled groups
// ---------------------------------------------------------------------------

interface MetricGridSectionProps {
  title: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  border?: boolean;
  className?: string;
}

function MetricGridSection({ title, subtitle, description, action, badge, border, className }: MetricGridSectionProps) {
  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      description={description}
      action={action}
      badge={badge}
      border={border}
      spacing={false}
      className={className}
    />
  );
}
MetricGridSection.displayName = "MetricGrid.Section";
(MetricGridSection as any).__gridHint = "full"; // eslint-disable-line @typescript-eslint/no-explicit-any

// ---------------------------------------------------------------------------
// Hint detection
// ---------------------------------------------------------------------------

function getComponentHint(el: React.ReactElement): GridHint | "unknown" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const type = el.type as any;
  if (type?.__gridHint) return type.__gridHint as GridHint;

  const name: string = type?.displayName || type?.name || "";
  if (/KpiCard/i.test(name)) return "kpi";
  if (/Gauge/i.test(name)) return "gauge";
  if (/StatGroup/i.test(name)) return "stat";
  if (/DataTable/i.test(name)) return "table";
  if (/AreaChart|LineChart|BarChart|BarLineChart|DonutChart|HeatMap|Funnel/i.test(name)) return "chart";
  if (/DashboardHeader/i.test(name)) return "header";
  return "unknown";
}

function getHint(child: React.ReactElement): GridHint | "unknown" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = child.props as any;
  if (child.type === MetricGridItem) {
    const inner = Children.toArray(props.children).find(isValidElement) as React.ReactElement | undefined;
    if (inner) return getComponentHint(inner);
    return "unknown";
  }
  return getComponentHint(child);
}

function getExplicitSpan(child: React.ReactElement): MetricGridItemProps["span"] | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (child.type === MetricGridItem) return (child.props as any).span;
  return undefined;
}

// ---------------------------------------------------------------------------
// Row group — a logical group of items that form one visual "row"
// ---------------------------------------------------------------------------

type RowType = "small" | "chart-pair" | "chart-triple" | "chart-multi" | "full" | "explicit";

interface RowGroup {
  type: RowType;
  items: {
    element: React.ReactElement;
    className?: string;
  }[];
  /** For chart pairs: split ratio */
  splits?: number[];
}

function isSmallHint(h: GridHint | "unknown"): boolean {
  return h === "kpi" || h === "gauge";
}

function isFullHint(h: GridHint | "unknown"): boolean {
  return h === "table" || h === "stat" || h === "header" || h === "full";
}

/** Recursively flatten React fragments so auto-layout sees through <>{...}</> wrappers */
function flattenFragments(children: React.ReactNode): React.ReactElement[] {
  const result: React.ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    // Fragments have a symbol as their type (React.Fragment === Symbol(react.fragment))
    if (typeof child.type === "symbol") {
      result.push(...flattenFragments((child.props as { children?: React.ReactNode }).children));
    } else {
      result.push(child);
    }
  });
  return result;
}

/** Group children into logical row groups */
function groupIntoRows(children: React.ReactNode, maxSmallPerRow: number): RowGroup[] {
  const rows: RowGroup[] = [];
  const elements: { el: React.ReactElement; hint: GridHint | "unknown"; span?: MetricGridItemProps["span"]; className?: string }[] = [];

  for (const child of flattenFragments(children)) {
    elements.push({
      el: child,
      hint: getHint(child),
      span: getExplicitSpan(child),
      className: child.type === MetricGridItem ? (child.props as any).className : undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
    });
  }

  let i = 0;
  while (i < elements.length) {
    const { el, hint, span, className } = elements[i];

    // Explicit span → standalone row with explicit handling
    if (span) {
      rows.push({
        type: "explicit",
        items: [{ element: el, className }],
        splits: [typeof span === "number" ? span : span === "full" ? 1 : span === "lg" ? 2 : span === "md" ? 1 : 1],
      });
      i++;
      continue;
    }

    // Full-width items
    if (isFullHint(hint)) {
      rows.push({ type: "full", items: [{ element: el, className }] });
      i++;
      continue;
    }

    // Small items (KPI, Gauge) — collect consecutive, split into rows of maxSmallPerRow
    if (isSmallHint(hint)) {
      // Collect all consecutive small items
      const allSmall: { element: React.ReactElement; className?: string }[] = [];
      while (i < elements.length && isSmallHint(elements[i].hint) && !elements[i].span) {
        allSmall.push({ element: elements[i].el, className: elements[i].className });
        i++;
      }
      // Split into rows of maxSmallPerRow
      for (let k = 0; k < allSmall.length; k += maxSmallPerRow) {
        rows.push({ type: "small", items: allSmall.slice(k, k + maxSmallPerRow) });
      }
      continue;
    }

    // Charts — collect consecutive
    if (hint === "chart") {
      const chartItems: { element: React.ReactElement; className?: string }[] = [];
      while (i < elements.length && elements[i].hint === "chart" && !elements[i].span) {
        chartItems.push({ element: elements[i].el, className: elements[i].className });
        i++;
      }

      if (chartItems.length === 1) {
        rows.push({ type: "full", items: chartItems });
      } else if (chartItems.length === 2) {
        rows.push({ type: "chart-pair", items: chartItems });
      } else if (chartItems.length === 3) {
        rows.push({ type: "chart-triple", items: chartItems });
      } else {
        // 4+ → pairs
        for (let k = 0; k < chartItems.length; k += 2) {
          const pair = chartItems.slice(k, k + 2);
          if (pair.length === 2) {
            rows.push({ type: "chart-pair", items: pair, splits: [1, 1] }); // Even split for 4+
          } else {
            rows.push({ type: "full", items: pair });
          }
        }
      }
      continue;
    }

    // Unknown → full width (never break someone's custom component)
    rows.push({ type: "full", items: [{ element: el, className }] });
    i++;
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Reveal wrapper — scroll-triggered entrance for each grid cell
// ---------------------------------------------------------------------------

function RevealCell({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, revealed } = useRevealOnScroll(delay);
  return (
    <div
      ref={ref}
      className={cn("mu-reveal", revealed && "mu-revealed", className)}
      style={style}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MetricGrid Component
// ---------------------------------------------------------------------------

interface MetricGridProps {
  children: React.ReactNode;
  /** Max small items per row (KPIs, Gauges). Default: 4 */
  columns?: number;
  /** Gap between items in px. Respects dense from MetricProvider. */
  gap?: number;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

const MetricGridRoot = forwardRef<HTMLDivElement, MetricGridProps>(function MetricGrid({
  children,
  columns: columnsProp,
  gap: gapProp,
  className,
  id,
  "data-testid": dataTestId,
}, ref) {
  const config = useMetricConfig();
  const { ref: containerRef, width: containerWidth } = useContainerSize();

  const denseValues = useDenseValues();
  const gap = gapProp ?? denseValues.gridGap;
  const maxSmallPerRow = columnsProp ?? 4;

  // --- Responsive: cap small items per row based on width ---
  const responsiveMaxSmall = useMemo(() => {
    if (containerWidth < 640) return 1;
    if (containerWidth < 1024) return Math.min(maxSmallPerRow, 2);
    return maxSmallPerRow;
  }, [containerWidth, maxSmallPerRow]);

  // --- Group children into row groups ---
  const rows = useMemo(
    () => groupIntoRows(children, responsiveMaxSmall),
    [children, responsiveMaxSmall],
  );

  return (
    <div
      ref={(el) => {
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      id={id}
      data-testid={dataTestId}
      className={cn("w-full", className)}
      style={{ display: "flex", flexDirection: "column", gap }}
    >
      {rows.map((row, ri) => {
        const unwrap = (item: { element: React.ReactElement; className?: string }) => {
          const el = item.element;
          const child = el.type === MetricGridItem ? (el.props as any).children : el; // eslint-disable-line @typescript-eslint/no-explicit-any
          return { child, className: item.className };
        };

        switch (row.type) {
          // Small items → equal-width columns, always filling the row
          case "small": {
            const count = row.items.length;
            return (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${count}, 1fr)`,
                  gap,
                }}
              >
                {row.items.map((item, ci) => {
                  const { child, className: cls } = unwrap(item);
                  return (
                    <RevealCell key={ci} delay={ci * 60} className={cls} style={{ minWidth: 0 }}>
                      {child}
                    </RevealCell>
                  );
                })}
              </div>
            );
          }

          // Two charts → 2fr + 1fr (or even if 4+ charts)
          case "chart-pair": {
            const even = row.splits && row.splits[0] === row.splits[1];
            const cols = even ? "1fr 1fr" : "2fr 1fr";
            return (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: containerWidth < 1024 ? "1fr" : cols,
                  gap,
                }}
              >
                {row.items.map((item, ci) => {
                  const { child, className: cls } = unwrap(item);
                  return (
                    <RevealCell key={ci} delay={ci * 60} className={cls} style={{ minWidth: 0 }}>
                      {child}
                    </RevealCell>
                  );
                })}
              </div>
            );
          }

          // Three charts → equal thirds
          case "chart-triple": {
            return (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: containerWidth < 1024 ? "1fr" : "1fr 1fr 1fr",
                  gap,
                }}
              >
                {row.items.map((item, ci) => {
                  const { child, className: cls } = unwrap(item);
                  return (
                    <RevealCell key={ci} delay={ci * 60} className={cls} style={{ minWidth: 0 }}>
                      {child}
                    </RevealCell>
                  );
                })}
              </div>
            );
          }

          // Full width
          case "full": {
            const { child, className: cls } = unwrap(row.items[0]);
            return (
              <RevealCell key={ri} className={cls}>
                {child}
              </RevealCell>
            );
          }

          // Explicit span (MetricGrid.Item with span prop) — just render it
          case "explicit": {
            const { child, className: cls } = unwrap(row.items[0]);
            return (
              <RevealCell key={ri} className={cls}>
                {child}
              </RevealCell>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const MetricGrid = Object.assign(MetricGridRoot, {
  Item: MetricGridItem,
  Section: MetricGridSection,
});

export type { MetricGridProps, MetricGridItemProps, MetricGridSectionProps };
