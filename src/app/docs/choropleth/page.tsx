"use client";

import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "data-format", title: "Data Format", level: 2 },
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "projections", title: "Projections", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

export default function ChoroplethDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Charts</span>
            <span>/</span>
            <span>Choropleth</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Choropleth</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            A geographic heatmap that colors regions by value. Each feature in the GeoJSON
            is shaded on a sequential color scale, making it easy to compare values across regions.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Choropleth for geographic data — revenue by country, user density by state,
          support tickets by region. The developer provides their own GeoJSON features,
          giving full control over which map to render (world, US states, EU countries, etc.).
          For non-geographic heatmaps use{" "}
          <a href="/docs/heatmap" className="font-medium text-[var(--accent)] hover:underline">
            HeatMap
          </a>
          ; for hierarchical area use{" "}
          <a href="/docs/treemap" className="font-medium text-[var(--accent)] hover:underline">
            Treemap
          </a>.
        </p>

        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            <strong className="text-amber-500">Note:</strong> Choropleth requires a GeoJSON FeatureCollection
            passed via the <code className="font-[family-name:var(--font-mono)] text-[13px]">features</code> prop.
            GeoJSON is not bundled with MetricUI — you provide your own (e.g.{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">world-atlas</code> from npm,
            or a custom shape file). The examples below show code-only usage patterns since live
            rendering requires map geometry.
          </p>
        </div>

        {/* Overview */}
        <DocSection id="overview" title="Overview">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The Choropleth component wraps Nivo&apos;s <code className="font-[family-name:var(--font-mono)] text-[12px]">ResponsiveChoropleth</code> with
            MetricUI&apos;s card shell, theming, format engine, cross-filtering, and drill-down. It accepts
            two data formats: native <code className="font-[family-name:var(--font-mono)] text-[12px]">ChoroplethDatum[]</code> ({`{ id, value }`}) or
            flat <code className="font-[family-name:var(--font-mono)] text-[12px]">DataRow[]</code> with configurable field names.
          </p>
        </DocSection>

        {/* Data Format */}
        <DocSection id="data-format" title="Data Format">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Each entry maps a region ISO code to a numeric value. Use{" "}
            <a
              href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              ISO 3166-1 alpha-3
            </a>{" "}
            codes that match the <code className="font-[family-name:var(--font-mono)] text-[12px]">feature.id</code> values
            in your GeoJSON.
          </p>
          <CodeBlock
            code={`const populationData = [
  { id: "USA", value: 328000000 },
  { id: "GBR", value: 67000000 },
  { id: "DEU", value: 83000000 },
  { id: "FRA", value: 67000000 },
  { id: "JPN", value: 126000000 },
  { id: "BRA", value: 213000000 },
  { id: "IND", value: 1380000000 },
  { id: "AUS", value: 26000000 },
];`}
            language="tsx"
          />
        </DocSection>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Install a GeoJSON source, then pass the features alongside your region data.
          </p>
          <CodeBlock
            code={`import { Choropleth } from "metricui";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";

// Extract GeoJSON features from TopoJSON
const worldFeatures = feature(worldTopo, worldTopo.objects.countries).features;

const populationData = [
  { id: "USA", value: 328000000 },
  { id: "GBR", value: 67000000 },
  { id: "DEU", value: 83000000 },
  { id: "FRA", value: 67000000 },
  { id: "JPN", value: 126000000 },
  { id: "BRA", value: 213000000 },
  { id: "IND", value: 1380000000 },
  { id: "AUS", value: 26000000 },
];

<Choropleth
  data={populationData}
  features={worldFeatures}
  title="Population by Country"
  format="compact"
  colors={["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]}
  domain={[0, 1400000000]}
  projectionType="naturalEarth1"
  projectionScale={120}
  height={450}
/>`}
            language="tsx"
          />
        </DocSection>

        {/* Projections */}
        <DocSection id="projections" title="Projections">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">projectionType</code> prop
            controls the map projection. Available options:{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">mercator</code> (default),{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">naturalEarth1</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">equalEarth</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">orthographic</code>.
          </p>
          <CodeBlock
            code={`// Natural Earth projection — less distortion at poles
<Choropleth
  data={populationData}
  features={worldFeatures}
  title="Global Population (Natural Earth)"
  projectionType="naturalEarth1"
  projectionScale={120}
  format="compact"
  height={400}
/>

// Orthographic (globe) projection
<Choropleth
  data={populationData}
  features={worldFeatures}
  title="Population Globe"
  projectionType="orthographic"
  projectionScale={200}
  projectionTranslation={[0.5, 0.5]}
  format="compact"
  height={400}
/>`}
            language="tsx"
          />
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "ChoroplethDatum[] | DataRow[]", default: "[]", description: "Region data: { id, value } or flat rows with idField + valueField." },
              { prop: "features", type: "GeoJSON Feature[]", default: "(required)", description: "GeoJSON FeatureCollection features. Each feature.id must match data id." },
              { prop: "idField", type: "string", default: '"id"', description: "Column name for region ISO code (flat format)." },
              { prop: "valueField", type: "string", default: '"value"', description: "Column name for region value (flat format)." },
              { prop: "title", type: "string", default: "\u2014", description: "Card title." },
              { prop: "subtitle", type: "string", default: "\u2014", description: "Card subtitle." },
              { prop: "height", type: "number", default: "400", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Sequential color scale stops." },
              { prop: "format", type: "FormatOption", default: "\u2014", description: "Format for value labels and tooltips." },
              { prop: "projectionType", type: '"mercator" | "naturalEarth1" | "equalEarth" | "orthographic"', default: '"mercator"', description: "Map projection type." },
              { prop: "projectionScale", type: "number", default: "100", description: "Projection scale factor." },
              { prop: "projectionTranslation", type: "[number, number]", default: "[0.5, 0.5]", description: "Projection translation [x, y]." },
              { prop: "borderWidth", type: "number", default: "0.5", description: "Border width on features." },
              { prop: "borderColor", type: "string", default: "theme-aware", description: "Border color." },
              { prop: "domain", type: "[number, number]", default: "auto", description: "Domain for the color scale [min, max]." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "\u2014", description: "Enable cross-filtering on region click." },
              { prop: "drillDown", type: "true | function", default: "\u2014", description: "true for auto table, or custom render function." },
              { prop: "drillDownMode", type: '"slide-over" | "modal"', default: '"slide-over"', description: "Drill-down panel mode." },
            ]}
            columns={[
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "default", header: "Default", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "The features prop is required. MetricUI does not bundle any map geometry \u2014 you provide GeoJSON from world-atlas, natural-earth-vector, or your own source.",
              "Each GeoJSON feature must have a feature.id that matches the id field in your data array.",
              "Use the domain prop to set explicit color scale boundaries. Auto-computed from data min/max if omitted.",
              "For US state maps, use a US-specific TopoJSON source and set projectionType to \u2018naturalEarth1\u2019 with appropriate scale/translation.",
              "Flat DataRow[] format uses idField and valueField to extract region codes and values.",
              "Built on @nivo/geo \u2014 all Nivo theming and tooltip conventions apply.",
            ].map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
          </ul>
        </DocSection>

        {/* Related */}
        <DocSection id="related" title="Related">
          <ul className="flex flex-wrap gap-2">
            {["HeatMap", "Treemap", "BarChart", "DataTable"].map((name) => (
              <li key={name}>
                <a
                  href={`/docs/${name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}`}
                  className="inline-block rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
