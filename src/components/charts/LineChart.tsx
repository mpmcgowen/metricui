"use client";

import { forwardRef } from "react";
import { AreaChart } from "./AreaChart";
import type { AreaChartProps } from "./AreaChart";
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";

export type LineChartProps = Omit<AreaChartProps, "enableArea" | "gradient" | "areaOpacity">;

const LineChartInner = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(props, ref) {
  return (
    <AreaChart
      ref={ref}
      {...props}
      enablePoints={props.enablePoints ?? true}
      pointSize={props.pointSize ?? 0}
      enableArea={false}
    />
  );
});

export const LineChart = withErrorBoundary(LineChartInner, "LineChart");
(LineChart as any).__gridHint = "chart";
