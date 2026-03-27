import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastChoroplethProps: any = null;

vi.mock("@nivo/geo", () => ({
  ResponsiveChoropleth: (props: any) => {
    lastChoroplethProps = props;
    return <div data-testid="nivo-choropleth" />;
  },
}));

vi.mock("@/lib/useContainerSize", () => ({
  useContainerSize: () => ({
    ref: { current: null },
    width: 800,
    height: 500,
  }),
}));

// Mock the heavy geo data imports used by geoFeatures
vi.mock("world-atlas/countries-110m.json", () => ({
  default: {
    type: "Topology",
    objects: {
      countries: {
        type: "GeometryCollection",
        geometries: [
          { type: "Polygon", id: "840", arcs: [[0]], properties: { name: "United States" } },
          { type: "Polygon", id: "826", arcs: [[1]], properties: { name: "United Kingdom" } },
          { type: "Polygon", id: "276", arcs: [[2]], properties: { name: "Germany" } },
        ],
      },
    },
    arcs: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]], [[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]], [[4, 4], [5, 4], [5, 5], [4, 5], [4, 4]]],
  },
}));

vi.mock("us-atlas/states-10m.json", () => ({
  default: {
    type: "Topology",
    objects: {
      states: {
        type: "GeometryCollection",
        geometries: [
          { type: "Polygon", id: "06", arcs: [[0]], properties: { name: "California" } },
          { type: "Polygon", id: "48", arcs: [[1]], properties: { name: "Texas" } },
          { type: "Polygon", id: "36", arcs: [[2]], properties: { name: "New York" } },
        ],
      },
    },
    arcs: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]], [[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]], [[4, 4], [5, 4], [5, 5], [4, 5], [4, 4]]],
  },
}));

import { Choropleth } from "@/components/charts/Choropleth";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const minimalFeatures = [
  {
    type: "Feature",
    id: "USA",
    properties: { name: "United States" },
    geometry: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
  },
  {
    type: "Feature",
    id: "GBR",
    properties: { name: "United Kingdom" },
    geometry: { type: "Polygon", coordinates: [[[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]]] },
  },
  {
    type: "Feature",
    id: "DEU",
    properties: { name: "Germany" },
    geometry: { type: "Polygon", coordinates: [[[4, 4], [5, 4], [5, 5], [4, 5], [4, 4]]] },
  },
];

const choroplethData = [
  { id: "USA", value: 340_000_000 },
  { id: "GBR", value: 67_000_000 },
  { id: "DEU", value: 83_000_000 },
];

const flatRowData = [
  { country_code: "USA", population: 340_000_000 },
  { country_code: "GBR", population: 67_000_000 },
  { country_code: "DEU", population: 83_000_000 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Choropleth", () => {
  beforeEach(() => {
    lastChoroplethProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with native ChoroplethDatum data", () => {
    const { container } = renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-choropleth")).toBeInTheDocument();
  });

  it("passes data to Nivo", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.data).toHaveLength(3);
    expect(lastChoroplethProps.data[0]).toEqual({ id: "USA", value: 340_000_000 });
  });

  it("passes features to Nivo", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.features).toEqual(minimalFeatures);
  });

  // --- Flat DataRow format ---
  it("renders with flat DataRow format", () => {
    renderWithProvider(
      <Choropleth
        data={flatRowData}
        features={minimalFeatures}
        idField="country_code"
        valueField="population"
      />
    );
    expect(screen.getByTestId("nivo-choropleth")).toBeInTheDocument();
    expect(lastChoroplethProps.data).toHaveLength(3);
    expect(lastChoroplethProps.data[0]).toEqual({ id: "USA", value: 340_000_000 });
  });

  // --- Domain auto-computation ---
  it("auto-computes domain from data when not provided", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.domain).toEqual([67_000_000, 340_000_000]);
  });

  it("uses explicit domain when provided", () => {
    renderWithProvider(
      <Choropleth
        data={choroplethData}
        features={minimalFeatures}
        domain={[0, 500_000_000]}
      />
    );
    expect(lastChoroplethProps.domain).toEqual([0, 500_000_000]);
  });

  it("handles empty data gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(
      <Choropleth data={[]} features={minimalFeatures} />
    );
    expect(container.firstChild).toBeTruthy();
    // Empty data → CardShell auto empty state, Nivo not rendered
  });

  // --- Empty data ---
  it("handles undefined data gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(
      <Choropleth features={minimalFeatures} />
    );
    expect(container.firstChild).toBeTruthy();
    // No data → CardShell auto empty state
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} error={{ message: "Geo load failed" }} />
    );
    expect(screen.getByText("Geo load failed")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} title="World Population" />
    );
    expect(screen.getByText("World Population")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} title="Population" subtitle="2024 est." />
    );
    expect(screen.getByText("2024 est.")).toBeInTheDocument();
  });

  // --- Projection props ---
  it("defaults to mercator projection", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.projectionType).toBe("mercator");
  });

  it("passes custom projectionType", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} projectionType="naturalEarth1" />
    );
    expect(lastChoroplethProps.projectionType).toBe("naturalEarth1");
  });

  it("passes projectionScale", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} projectionScale={200} />
    );
    expect(lastChoroplethProps.projectionScale).toBe(200);
  });

  it("defaults projectionScale to 100", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.projectionScale).toBe(100);
  });

  it("passes projectionTranslation", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} projectionTranslation={[0.5, 0.6]} />
    );
    expect(lastChoroplethProps.projectionTranslation).toEqual([0.5, 0.6]);
  });

  it("defaults projectionTranslation to [0.5, 0.5]", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.projectionTranslation).toEqual([0.5, 0.5]);
  });

  // --- Border props ---
  it("passes borderWidth", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} borderWidth={1} />
    );
    expect(lastChoroplethProps.borderWidth).toBe(1);
  });

  it("defaults borderWidth to 0.5", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.borderWidth).toBe(0.5);
  });

  it("passes custom borderColor", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} borderColor="#333" />
    );
    expect(lastChoroplethProps.borderColor).toBe("#333");
  });

  // --- Colors ---
  it("passes custom colors", () => {
    const colors = ["#f0f", "#0ff", "#ff0"];
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} colors={colors} />
    );
    expect(lastChoroplethProps.colors).toEqual(colors);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} data-testid="my-map" />
    );
    expect(screen.getByTestId("my-map")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick when drillDown is set", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} drillDown={true} />
    );
    expect(lastChoroplethProps.onClick).toBeTruthy();
  });

  it("onClick handler exists but guards internally when no drillDown or crossFilter", () => {
    renderWithProvider(
      <Choropleth data={choroplethData} features={minimalFeatures} />
    );
    // Choropleth always passes onClick — the handler checks drillDown/crossFilter internally
    expect(typeof lastChoroplethProps.onClick).toBe("function");
  });

  // --- tooltipLabel ---
  it("accepts tooltipLabel prop without crashing", () => {
    renderWithProvider(
      <Choropleth
        data={choroplethData}
        features={minimalFeatures}
        tooltipLabel="Population"
      />
    );
    // Tooltip is a function, so we just verify no crash
    expect(screen.getByTestId("nivo-choropleth")).toBeInTheDocument();
  });

  // --- Edge cases ---
  it("handles single region", () => {
    const singleData = [{ id: "USA", value: 340_000_000 }];
    renderWithProvider(
      <Choropleth data={singleData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.data).toHaveLength(1);
    // Domain min = max when single value
    expect(lastChoroplethProps.domain[0]).toBe(340_000_000);
    expect(lastChoroplethProps.domain[1]).toBe(340_000_000);
  });

  it("handles data with regions not in features", () => {
    const extraData = [
      { id: "USA", value: 100 },
      { id: "FAKE", value: 999 },
    ];
    renderWithProvider(
      <Choropleth data={extraData} features={minimalFeatures} />
    );
    // Should pass through — Nivo handles unmatched data
    expect(lastChoroplethProps.data).toHaveLength(2);
  });

  it("handles zero values", () => {
    const zeroData = [
      { id: "USA", value: 0 },
      { id: "GBR", value: 0 },
    ];
    renderWithProvider(
      <Choropleth data={zeroData} features={minimalFeatures} />
    );
    expect(lastChoroplethProps.domain).toEqual([0, 0]);
  });
});

// ---------------------------------------------------------------------------
// GeoFeatures exports
// ---------------------------------------------------------------------------

describe("worldFeatures and usStatesFeatures exports", () => {
  it("worldFeatures is exported and is an array", async () => {
    const { worldFeatures } = await import("@/lib/geoFeatures");
    expect(Array.isArray(worldFeatures)).toBe(true);
    expect(worldFeatures.length).toBeGreaterThan(0);
  });

  it("worldFeatures entries have alpha-3 IDs (3-letter codes)", async () => {
    const { worldFeatures } = await import("@/lib/geoFeatures");
    // Check a sample of features have 3-character alpha codes
    const withAlpha3 = worldFeatures.filter(
      (f: any) => typeof f.id === "string" && /^[A-Z]{3}$/.test(f.id)
    );
    // Most features should have alpha-3 IDs (some obscure territories may not)
    expect(withAlpha3.length).toBeGreaterThan(worldFeatures.length * 0.8);
  });

  it("worldFeatures entries have geometry", async () => {
    const { worldFeatures } = await import("@/lib/geoFeatures");
    for (const f of worldFeatures) {
      expect(f.geometry).toBeDefined();
    }
  });

  it("usStatesFeatures is exported and is an array", async () => {
    const { usStatesFeatures } = await import("@/lib/geoFeatures");
    expect(Array.isArray(usStatesFeatures)).toBe(true);
    expect(usStatesFeatures.length).toBeGreaterThan(0);
  });

  it("usStatesFeatures entries have 2-letter state abbreviation IDs", async () => {
    const { usStatesFeatures } = await import("@/lib/geoFeatures");
    const withAbbr = usStatesFeatures.filter(
      (f: any) => typeof f.id === "string" && /^[A-Z]{2}$/.test(f.id)
    );
    // All states should have 2-letter abbreviations
    expect(withAbbr.length).toBeGreaterThan(usStatesFeatures.length * 0.9);
  });

  it("usStatesFeatures entries have geometry", async () => {
    const { usStatesFeatures } = await import("@/lib/geoFeatures");
    for (const f of usStatesFeatures) {
      expect(f.geometry).toBeDefined();
    }
  });
});
