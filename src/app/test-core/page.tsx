"use client";

import {
  useContainerSize,
  useChartDimensions,
  useBandScale,
  useLinearScale,
  useElementInteraction,
  useTooltip,
  useStackedData,
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

      <section>
        <h2 className="text-lg font-semibold mb-4">
          4. Stacked Bar Chart
        </h2>
        <StackedBarChart />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          5. Negative Values
        </h2>
        <NegativeBarChart />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          6. Edge Cases (single bar, zero values)
        </h2>
        <EdgeCaseBarChart />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          7. Large Dataset (30 bars)
        </h2>
        <LargeBarChart />
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
              offset={dims.innerHeight}
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
              offset={dims.innerHeight}
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
    margin: { top: 30, right: 30, bottom: 40, left: 50 },
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
              offset={dims.innerHeight}
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

// ---------------------------------------------------------------------------
// 4. Stacked Bar Chart
// ---------------------------------------------------------------------------
function StackedBarChart() {
  const { ref, width } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: 350,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  });

  const keys = ["revenue", "expenses"];
  const STACK_COLORS = ["#4F46E5", "#10B981"];

  const { series } = useStackedData({
    data,
    keys,
  });

  const xScale = useBandScale({
    domain: data.map((d) => d.month),
    range: [0, dims.innerWidth],
    paddingInner: 0.3,
  });

  const maxStacked = Math.max(...data.map((d) => d.revenue + d.expenses));
  const yScale = useLinearScale({
    domain: [0, maxStacked],
    range: [dims.innerHeight, 0],
    nice: true,
  });

  return (
    <div ref={ref} style={{ width: "100%", height: 350 }}>
      {width > 0 && (
        <>
          <ChartSvg width={width} height={350} margin={dims.margin} aria-label="Stacked bar chart">
            <GridLines yScale={yScale} width={dims.innerWidth} height={dims.innerHeight} lineProps={{ stroke: "#e5e7eb" }} />
            {series.map((s, si) => (
              <Bars
                key={s.key}
                data={s.data}
                xScale={xScale}
                yScale={yScale}
                x={(d: any) => d.datum.month}
                y={(d: any) => d.upper}
                y0={(d: any) => d.lower}
                rx={si === series.length - 1 ? 4 : 0}
                style={() => ({ fill: STACK_COLORS[si] })}
              />
            ))}
            <Axis scale={xScale} position="bottom" offset={dims.innerHeight}
              tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "middle" as const })}
              lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
            />
            <Axis scale={yScale} position="left"
              tickFormat={(v: any) => `$${v / 1000}k`}
              tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "end" as const })}
              lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
            />
          </ChartSvg>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {keys.map((key, i) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: STACK_COLORS[i] }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Negative Values
// ---------------------------------------------------------------------------
const profitLossData = [
  { month: "Jan", profit: 14000 },
  { month: "Feb", profit: 7000 },
  { month: "Mar", profit: 26000 },
  { month: "Apr", profit: -5000 },
  { month: "May", profit: 29000 },
  { month: "Jun", profit: -12000 },
  { month: "Jul", profit: 35000 },
  { month: "Aug", profit: -3000 },
];

function NegativeBarChart() {
  const { ref, width } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: 350,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  });

  const xScale = useBandScale({
    domain: profitLossData.map((d) => d.month),
    range: [0, dims.innerWidth],
    paddingInner: 0.3,
  });

  const yScale = useLinearScale({
    data: profitLossData,
    accessor: (d: (typeof profitLossData)[0]) => d.profit,
    range: [dims.innerHeight, 0],
    nice: true,
  });

  return (
    <div ref={ref} style={{ width: "100%", height: 350 }}>
      {width > 0 && (
        <ChartSvg width={width} height={350} margin={dims.margin} aria-label="Profit/loss with negatives">
          <GridLines yScale={yScale} width={dims.innerWidth} height={dims.innerHeight} lineProps={{ stroke: "#e5e7eb" }} />
          <ReferenceLine scale={yScale} value={0} orientation="horizontal" length={dims.innerWidth}
            lineProps={{ stroke: "#9ca3af", strokeWidth: 1 }}
          />
          <Bars data={profitLossData} xScale={xScale} yScale={yScale} x="month" y="profit" rx={4}
            style={(d: (typeof profitLossData)[0]) => ({
              fill: d.profit >= 0 ? "#4F46E5" : "#ef4444",
            })}
          />
          <Axis scale={xScale} position="bottom" offset={dims.innerHeight}
            tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "middle" as const })}
            lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
          />
          <Axis scale={yScale} position="left"
            tickFormat={(v: any) => `$${v / 1000}k`}
            tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "end" as const })}
            lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
          />
        </ChartSvg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Edge Cases — single bar, zero values
// ---------------------------------------------------------------------------
const edgeCaseData = [{ label: "Only Item", value: 42000 }];

const zeroData = [
  { label: "A", value: 50000 },
  { label: "B", value: 0 },
  { label: "C", value: 30000 },
  { label: "D", value: 0 },
  { label: "E", value: 10000 },
];

function EdgeCaseBarChart() {
  const { ref, width } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: 280,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  });

  const halfWidth = Math.floor((dims.innerWidth - 40) / 2);

  const singleXScale = useBandScale({ domain: ["Only Item"], range: [0, halfWidth], paddingInner: 0.3 });
  const singleYScale = useLinearScale({ domain: [0, 42000], range: [dims.innerHeight, 0], nice: true });

  const zeroXScale = useBandScale({ domain: zeroData.map((d) => d.label), range: [0, halfWidth], paddingInner: 0.3 });
  const zeroYScale = useLinearScale({ data: zeroData, accessor: (d: (typeof zeroData)[0]) => d.value, range: [dims.innerHeight, 0], nice: true, includeZero: true });

  return (
    <div ref={ref} style={{ width: "100%", height: 280 }}>
      {width > 0 && (
        <div style={{ display: "flex", gap: 40 }}>
          <div>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Single bar</p>
            <ChartSvg width={halfWidth + 80} height={260} margin={dims.margin} aria-label="Single bar test">
              <GridLines yScale={singleYScale} width={halfWidth} height={dims.innerHeight} lineProps={{ stroke: "#e5e7eb" }} />
              <Bars data={edgeCaseData} xScale={singleXScale} yScale={singleYScale} x="label" y="value" rx={4}
                style={() => ({ fill: "#4F46E5" })}
              />
              <Axis scale={singleXScale} position="bottom" offset={dims.innerHeight}
                tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "middle" as const })}
                lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
              />
              <Axis scale={singleYScale} position="left"
                tickFormat={(v: any) => `$${v / 1000}k`}
                tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "end" as const })}
                lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
              />
            </ChartSvg>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Zero values (B and D are 0)</p>
            <ChartSvg width={halfWidth + 80} height={260} margin={dims.margin} aria-label="Zero values test">
              <GridLines yScale={zeroYScale} width={halfWidth} height={dims.innerHeight} lineProps={{ stroke: "#e5e7eb" }} />
              <Bars data={zeroData} xScale={zeroXScale} yScale={zeroYScale} x="label" y="value" rx={4}
                style={(d: (typeof zeroData)[0]) => ({ fill: d.value === 0 ? "#d1d5db" : "#4F46E5" })}
              />
              <Axis scale={zeroXScale} position="bottom" offset={dims.innerHeight}
                tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "middle" as const })}
                lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
              />
              <Axis scale={zeroYScale} position="left"
                tickFormat={(v: any) => `$${v / 1000}k`}
                tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "end" as const })}
                lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
              />
            </ChartSvg>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. Large Dataset (30 bars)
// ---------------------------------------------------------------------------
const largeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: Math.round(Math.random() * 80000 + 10000),
}));

function LargeBarChart() {
  const { ref, width } = useContainerSize();
  const dims = useChartDimensions({
    width,
    height: 350,
    margin: { top: 20, right: 20, bottom: 50, left: 60 },
  });

  const xScale = useBandScale({
    domain: largeData.map((d) => d.day),
    range: [0, dims.innerWidth],
    paddingInner: 0.15,
  });

  const yScale = useLinearScale({
    data: largeData,
    accessor: (d: (typeof largeData)[0]) => d.value,
    range: [dims.innerHeight, 0],
    nice: true,
    includeZero: true,
  });

  const { hoveredIndex, onHover, onHoverEnd } =
    useElementInteraction<(typeof largeData)[0]>();
  const tooltip = useTooltip<(typeof largeData)[0]>();

  return (
    <div ref={ref} style={{ width: "100%", height: 350 }}>
      {width > 0 && (
        <>
          <ChartSvg width={width} height={350} margin={dims.margin} aria-label="30 bars">
            <GridLines yScale={yScale} width={dims.innerWidth} height={dims.innerHeight} lineProps={{ stroke: "#e5e7eb" }} />
            <Bars data={largeData} xScale={xScale} yScale={yScale} x="day" y="value" rx={2}
              style={(_d: any, i: number) => ({
                fill: hoveredIndex === i ? "#3730a3" : "#4F46E5",
                cursor: "pointer",
              })}
              onHover={(e: any) => { onHover(e); tooltip.show({ datum: e.datum, clientX: e.clientX, clientY: e.clientY }); }}
              onHoverEnd={() => { onHoverEnd(); tooltip.hide(); }}
            />
            <Axis scale={xScale} position="bottom" offset={dims.innerHeight}
              tickFormat={(v: any) => String(v).replace("Day ", "")}
              tickLabelProps={() => ({ fontSize: 9, fill: "#6b7280", textAnchor: "middle" as const })}
              lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
            />
            <Axis scale={yScale} position="left"
              tickFormat={(v: any) => `$${v / 1000}k`}
              tickLabelProps={() => ({ fontSize: 11, fill: "#6b7280", textAnchor: "end" as const })}
              lineProps={{ stroke: "#d1d5db" }} tickLineProps={{ stroke: "#d1d5db" }}
            />
          </ChartSvg>
          <TooltipPortal isVisible={tooltip.isVisible} clientX={tooltip.position?.clientX ?? 0} clientY={tooltip.position?.clientY ?? 0} clampToViewport anchor="top-center" offset={{ y: -12 }}>
            <div style={{ background: "#1f2937", color: "#fff", padding: "8px 12px", borderRadius: 6, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <strong>{tooltip.datum?.day}</strong>: ${tooltip.datum?.value.toLocaleString()}
            </div>
          </TooltipPortal>
        </>
      )}
    </div>
  );
}
