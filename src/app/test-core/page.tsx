"use client";

import {
  useContainerSize,
  useChartDimensions,
  useBandScale,
  useLinearScale,
  useElementInteraction,
  useTooltip,
  ChartSvg,
  Axis,
  GridLines,
  Bars,
  ReferenceLine,
  TooltipPortal,
  Crosshair,
  easings,
} from "@metricui/core";

// --- Sample data ---
const data = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 38000, expenses: 31000 },
  { month: "Mar", revenue: 55000, expenses: 29000 },
  { month: "Apr", revenue: 47000, expenses: 35000 },
  { month: "May", revenue: 62000, expenses: 33000 },
  { month: "Jun", revenue: 58000, expenses: 37000 },
  { month: "Jul", revenue: 71000, expenses: 36000 },
  { month: "Aug", revenue: 65000, expenses: 40000 },
];

const COLORS = ["#4F46E5", "#10B981"];

export default function TestCorePage() {
  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">MetricCore Test Page</h1>
      <p className="text-gray-500">
        These charts are rendered entirely by @metricui/core primitives — no
        Nivo.
      </p>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          1. Simple Bar Chart (single series)
        </h2>
        <SimpleBarChart />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          2. Grouped Bar Chart (multi-series)
        </h2>
        <GroupedBarChart />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          3. Horizontal Bar Chart
        </h2>
        <HorizontalBarChart />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Simple Bar Chart
// ---------------------------------------------------------------------------
function SimpleBarChart() {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: height || 350,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  });

  const xScale = useBandScale({
    domain: data.map((d) => d.month),
    range: [0, dims.innerWidth],
    paddingInner: 0.3,
    paddingOuter: 0.1,
  });

  const yScale = useLinearScale({
    data,
    accessor: (d) => d.revenue,
    range: [dims.innerHeight, 0],
    nice: true,
    includeZero: true,
  });

  const { hoveredDatum, hoveredIndex, onHover, onHoverEnd } =
    useElementInteraction<(typeof data)[0]>();

  const tooltip = useTooltip<(typeof data)[0]>();

  return (
    <div ref={ref} style={{ width: "100%", height: 350 }}>
      {width > 0 && (
        <>
          <ChartSvg
            width={width}
            height={350}
            margin={dims.margin}
            aria-label="Monthly revenue bar chart"
          >
            <GridLines
              yScale={yScale}
              width={dims.innerWidth}
              height={dims.innerHeight}
              lineProps={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            />
            <ReferenceLine
              scale={yScale}
              value={50000}
              orientation="horizontal"
              length={dims.innerWidth}
              label="Target"
              lineProps={{
                stroke: "#ef4444",
                strokeDasharray: "6 3",
                strokeWidth: 1,
              }}
              labelProps={{ fontSize: 10, fill: "#ef4444" }}
            />
            <Bars
              data={data}
              xScale={xScale}
              yScale={yScale}
              x="month"
              y="revenue"
              rx={4}
              style={(d, i) => ({
                fill:
                  hoveredIndex === i ? "#3730a3" : "#4F46E5",
                cursor: "pointer",
                transition: "fill 150ms",
              })}
              onHover={(e) => {
                onHover(e);
                tooltip.show({
                  datum: e.datum,
                  clientX: e.clientX,
                  clientY: e.clientY,
                });
              }}
              onHoverEnd={() => {
                onHoverEnd();
                tooltip.hide();
              }}
              aria-label={(d) =>
                `${d.month}: $${d.revenue.toLocaleString()}`
              }
            />
            <Axis
              scale={xScale}
              position="bottom"
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "middle" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
            <Axis
              scale={yScale}
              position="left"
              tickFormat={(v) => `$${(v as number) / 1000}k`}
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "end" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
          </ChartSvg>
          <TooltipPortal
            isVisible={tooltip.isVisible}
            clientX={tooltip.position?.clientX ?? 0}
            clientY={tooltip.position?.clientY ?? 0}
            clampToViewport
            anchor="top-center"
            offset={{ y: -12 }}
          >
            <div
              style={{
                background: "#1f2937",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{tooltip.datum?.month}</strong>: $
              {tooltip.datum?.revenue.toLocaleString()}
            </div>
          </TooltipPortal>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Grouped Bar Chart (revenue + expenses side by side)
// ---------------------------------------------------------------------------
function GroupedBarChart() {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: height || 350,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  });

  const keys = ["revenue", "expenses"];

  // Flatten data for grouped rendering
  const flatData = data.flatMap((d) =>
    keys.map((key) => ({
      month: d.month,
      key,
      value: d[key as keyof typeof d] as number,
    }))
  );

  const xScale = useBandScale({
    domain: data.map((d) => d.month),
    range: [0, dims.innerWidth],
    paddingInner: 0.2,
    paddingOuter: 0.1,
  });

  const groupScale = useBandScale({
    domain: keys,
    range: [0, xScale.bandwidth()],
    paddingInner: 0.05,
  });

  const yScale = useLinearScale({
    data: flatData,
    accessor: (d) => d.value,
    range: [dims.innerHeight, 0],
    nice: true,
    includeZero: true,
  });

  const { hoveredIndex, onHover, onHoverEnd } =
    useElementInteraction<(typeof flatData)[0]>();
  const tooltip = useTooltip<(typeof flatData)[0]>();

  return (
    <div ref={ref} style={{ width: "100%", height: 350 }}>
      {width > 0 && (
        <>
          <ChartSvg
            width={width}
            height={350}
            margin={dims.margin}
            aria-label="Monthly revenue vs expenses grouped bar chart"
          >
            <GridLines
              yScale={yScale}
              width={dims.innerWidth}
              height={dims.innerHeight}
              lineProps={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            />
            <Bars
              data={flatData}
              xScale={xScale}
              yScale={yScale}
              x="month"
              y="value"
              groupScale={groupScale}
              groupKey="key"
              rx={3}
              style={(d, i) => ({
                fill:
                  hoveredIndex === i
                    ? d.key === "revenue"
                      ? "#3730a3"
                      : "#059669"
                    : d.key === "revenue"
                      ? COLORS[0]
                      : COLORS[1],
                cursor: "pointer",
                transition: "fill 150ms",
              })}
              onHover={(e) => {
                onHover(e);
                tooltip.show({
                  datum: e.datum,
                  clientX: e.clientX,
                  clientY: e.clientY,
                });
              }}
              onHoverEnd={() => {
                onHoverEnd();
                tooltip.hide();
              }}
            />
            <Axis
              scale={xScale}
              position="bottom"
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "middle" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
            <Axis
              scale={yScale}
              position="left"
              tickFormat={(v) => `$${(v as number) / 1000}k`}
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "end" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
          </ChartSvg>
          <TooltipPortal
            isVisible={tooltip.isVisible}
            clientX={tooltip.position?.clientX ?? 0}
            clientY={tooltip.position?.clientY ?? 0}
            clampToViewport
            anchor="top-center"
            offset={{ y: -12 }}
          >
            <div
              style={{
                background: "#1f2937",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{tooltip.datum?.month}</strong> —{" "}
              {tooltip.datum?.key}: $
              {tooltip.datum?.value.toLocaleString()}
            </div>
          </TooltipPortal>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {keys.map((key, i) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: COLORS[i],
                  }}
                />
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Horizontal Bar Chart
// ---------------------------------------------------------------------------
function HorizontalBarChart() {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: height || 300,
    margin: { top: 10, right: 30, bottom: 30, left: 80 },
  });

  const sorted = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  const xScale = useBandScale({
    domain: sorted.map((d) => d.month),
    range: [0, dims.innerHeight],
    paddingInner: 0.25,
  });

  const yScale = useLinearScale({
    data: sorted,
    accessor: (d) => d.revenue,
    range: [0, dims.innerWidth],
    nice: true,
    includeZero: true,
  });

  const { hoveredIndex, onHover, onHoverEnd } =
    useElementInteraction<(typeof sorted)[0]>();
  const tooltip = useTooltip<(typeof sorted)[0]>();

  return (
    <div ref={ref} style={{ width: "100%", height: 300 }}>
      {width > 0 && (
        <>
          <ChartSvg
            width={width}
            height={300}
            margin={dims.margin}
            aria-label="Revenue by month horizontal bar chart"
          >
            <GridLines
              xScale={yScale}
              width={dims.innerWidth}
              height={dims.innerHeight}
              lineProps={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            />
            <Bars
              data={sorted}
              xScale={xScale}
              yScale={yScale}
              x="month"
              y="revenue"
              orientation="horizontal"
              rx={4}
              style={(d, i) => ({
                fill:
                  hoveredIndex === i ? "#3730a3" : "#4F46E5",
                cursor: "pointer",
                transition: "fill 150ms",
              })}
              onHover={(e) => {
                onHover(e);
                tooltip.show({
                  datum: e.datum,
                  clientX: e.clientX,
                  clientY: e.clientY,
                });
              }}
              onHoverEnd={() => {
                onHoverEnd();
                tooltip.hide();
              }}
            />
            <Axis
              scale={xScale}
              position="left"
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "end" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
            <Axis
              scale={yScale}
              position="bottom"
              tickFormat={(v) => `$${(v as number) / 1000}k`}
              tickLabelProps={() => ({
                fontSize: 11,
                fill: "#6b7280",
                textAnchor: "middle" as const,
              })}
              lineProps={{ stroke: "#d1d5db" }}
              tickLineProps={{ stroke: "#d1d5db" }}
            />
          </ChartSvg>
          <TooltipPortal
            isVisible={tooltip.isVisible}
            clientX={tooltip.position?.clientX ?? 0}
            clientY={tooltip.position?.clientY ?? 0}
            clampToViewport
            anchor="top-center"
            offset={{ y: -12 }}
          >
            <div
              style={{
                background: "#1f2937",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{tooltip.datum?.month}</strong>: $
              {tooltip.datum?.revenue.toLocaleString()}
            </div>
          </TooltipPortal>
        </>
      )}
    </div>
  );
}
