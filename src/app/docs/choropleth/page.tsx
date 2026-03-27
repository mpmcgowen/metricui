"use client";

import { useMemo } from "react";
import { Choropleth } from "@/components/charts/Choropleth";
import { worldFeatures } from "@/lib/geoFeatures";
import { countries } from "@/data/world";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";
import countries_lib from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries_lib.registerLocale(enLocale);

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "projections", title: "Projections", level: 2 },
  { id: "custom-colors", title: "Custom Colors", level: 2 },
  { id: "data-format", title: "Data Format", level: 2 },
  { id: "bundled-features", title: "Bundled Features", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Build choropleth data from the world countries dataset
// ---------------------------------------------------------------------------

/** Common short names → alpha-3 for names i18n-iso-countries doesn't recognize */
const NAME_ALIASES: Record<string, string> = {
  "DR Congo": "COD",
  "Laos": "LAO",
  "Syria": "SYR",
  "Brunei": "BRN",
  "East Timor": "TLS",
  "Timor-Leste": "TLS",
  "Macau": "MAC",
  "Moldova": "MDA",
  "Réunion": "REU",
  "Curaçao": "CUW",
  "São Tomé and Príncipe": "STP",
  "Sint Maarten": "SXM",
  "Saint Martin": "MAF",
  "Micronesia": "FSM",
  "Falkland Islands": "FLK",
  "Vatican City": "VAT",
  "British Virgin Islands": "VGB",
  "United States Virgin Islands": "VIR",
  "Saint Helena, Ascension and Tristan da Cunha": "SHN",
  "Caribbean Netherlands": "BES",
  "French Southern and Antarctic Lands": "ATF",
};

/** Resolve country name → alpha-3 code */
function nameToAlpha3(name: string): string | undefined {
  return NAME_ALIASES[name] ?? countries_lib.getAlpha3Code(name, "en") ?? undefined;
}

// Set of alpha-3 codes that exist in worldFeatures (so we don't show data for features not on the map)
const WORLD_FEATURE_IDS = new Set(worldFeatures.map((f: any) => String(f.id)));

export default function ChoroplethDocs() {
  // Derive population data from the real world dataset
  const populationData = useMemo(
    () =>
      countries
        .map((c) => {
          const alpha3 = nameToAlpha3(c.name);
          return alpha3 && WORLD_FEATURE_IDS.has(alpha3) ? { id: alpha3, value: c.population } : null;
        })
        .filter(Boolean) as { id: string; value: number }[],
    [],
  );

  // Area data for second example
  const areaData = useMemo(
    () =>
      countries
        .map((c) => {
          const alpha3 = nameToAlpha3(c.name);
          return alpha3 && WORLD_FEATURE_IDS.has(alpha3) ? { id: alpha3, value: c.area } : null;
        })
        .filter(Boolean) as { id: string; value: number }[],
    [],
  );

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
          support tickets by region. Pass GeoJSON features to control which map renders
          (world, US states, EU countries, etc.). MetricUI bundles{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">worldFeatures</code> out
          of the box, or bring your own. For non-geographic heatmaps use{" "}
          <a href="/docs/heatmap" className="font-medium text-[var(--accent)] hover:underline">
            HeatMap
          </a>
          ; for hierarchical area use{" "}
          <a href="/docs/treemap" className="font-medium text-[var(--accent)] hover:underline">
            Treemap
          </a>.
        </p>

        {/* Overview */}
        <DocSection id="overview" title="Overview">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The Choropleth component wraps Nivo&apos;s <code className="font-[family-name:var(--font-mono)] text-[12px]">ResponsiveChoropleth</code> with
            MetricUI&apos;s card shell, theming, format engine, cross-filtering, and drill-down. It accepts
            two data formats: native <code className="font-[family-name:var(--font-mono)] text-[12px]">ChoroplethDatum[]</code> ({`{ id, value }`}) or
            flat <code className="font-[family-name:var(--font-mono)] text-[12px]">DataRow[]</code> with configurable field names.
          </p>
        </DocSection>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Import <code className="font-[family-name:var(--font-mono)] text-[12px]">worldFeatures</code> from
            MetricUI and pass it alongside your region data. Feature IDs are standard ISO 3166-1
            alpha-3 codes (e.g. <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;USA&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;GBR&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;HND&quot;</code>).
          </p>
          <ComponentExample
            code={`import { Choropleth, worldFeatures } from "metricui";

const populationData = [
  { id: "USA", value: 340_000_000 },
  { id: "GBR", value: 67_000_000 },
  { id: "DEU", value: 83_000_000 },
  { id: "IND", value: 1_417_000_000 },
  { id: "CHN", value: 1_408_000_000 },
  { id: "BRA", value: 213_000_000 },
  // ...
];

<Choropleth
  data={populationData}
  features={worldFeatures}
  title="Population"
  tooltipLabel="Population"
  format="compact"
  scaleType="sqrt"
  projectionType="naturalEarth1"
  projectionScale={120}
  height={450}
/>`}
          >
            <div className="w-full">
              <Choropleth
                data={populationData}
                features={worldFeatures}
                title="Population by Country"
                tooltipLabel="Population"
                format="compact"
                scaleType="sqrt"
                projectionType="naturalEarth1"
                projectionScale={120}
                height={450}
              />
            </div>
          </ComponentExample>
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
          <ComponentExample
            code={`<Choropleth
  data={areaData}
  features={worldFeatures}
  title="Land Area (km²)"
  tooltipLabel="Area"
  format={{ style: "number", suffix: " km²", compact: true }}
  projectionType="equalEarth"
  projectionScale={130}
  colors={["#fef3c7", "#f59e0b", "#b45309", "#78350f"]}
  height={400}
/>`}
          >
            <div className="w-full">
              <Choropleth
                data={areaData}
                features={worldFeatures}
                title="Land Area (km²)"
                tooltipLabel="Area"
                format={{ style: "number", suffix: " km²", compact: true }}
                projectionType="equalEarth"
                projectionScale={130}
                colors={["#fef3c7", "#f59e0b", "#b45309", "#78350f"]}
                height={400}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Colors */}
        <DocSection id="custom-colors" title="Custom Colors">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[12px]">colors</code> array to
            define the sequential color scale. Colors are interpolated between stops based on the data domain.
          </p>
          <ComponentExample
            code={`<Choropleth
  data={populationData}
  features={worldFeatures}
  title="Population — Cool Palette"
  format="compact"
  scaleType="sqrt"
  projectionType="naturalEarth1"
  projectionScale={120}
  colors={["#ecfdf5", "#6ee7b7", "#059669", "#064e3b"]}
  height={400}
/>`}
          >
            <div className="w-full">
              <Choropleth
                data={populationData}
                features={worldFeatures}
                title="Population — Cool Palette"
                format="compact"
                scaleType="sqrt"
                projectionType="naturalEarth1"
                projectionScale={120}
                colors={["#ecfdf5", "#6ee7b7", "#059669", "#064e3b"]}
                height={400}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Data Format */}
        <DocSection id="data-format" title="Data Format">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Choropleth accepts two data formats. The native format uses{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">{`{ id, value }`}</code> objects.
            For flat DataRow arrays, specify <code className="font-[family-name:var(--font-mono)] text-[12px]">idField</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">valueField</code> to map columns.
          </p>
          <CodeBlock
            code={`// Native format — id is an ISO 3166-1 alpha-3 code
const data = [
  { id: "USA", value: 340_000_000 },
  { id: "GBR", value: 67_000_000 },
];

// Flat DataRow format
const rows = [
  { country_code: "USA", population: 340_000_000 },
  { country_code: "GBR", population: 67_000_000 },
];

<Choropleth
  data={rows}
  features={worldFeatures}
  idField="country_code"
  valueField="population"
/>`}
            language="tsx"
          />
        </DocSection>

        {/* Bundled Features */}
        <DocSection id="bundled-features" title="Bundled Features">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI bundles <code className="font-[family-name:var(--font-mono)] text-[12px]">worldFeatures</code> — world
            country boundaries at 110m resolution (~105KB). Feature IDs are standard ISO 3166-1 alpha-3 codes
            (USA, GBR, DEU, etc.).
          </p>
          <CodeBlock
            code={`import { Choropleth, worldFeatures } from "metricui";

// worldFeatures is ready to use — no extra packages needed
<Choropleth data={myData} features={worldFeatures} />`}
            language="tsx"
          />

          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For other maps (US states, EU countries, custom regions), provide your own GeoJSON.
            Recommended sources:
          </p>
          <ul className="mt-2 space-y-1">
            {[
              { label: "world-atlas", desc: "World and US TopoJSON (npm)" },
              { label: "natural-earth-vector", desc: "High-res country/state/province shapefiles" },
              { label: "us-atlas", desc: "US states and counties TopoJSON (npm)" },
            ].map(({ label, desc }) => (
              <li
                key={label}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <span>
                  <code className="font-[family-name:var(--font-mono)] text-[12px] font-semibold">{label}</code> — {desc}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
            <p className="text-[13px] leading-relaxed text-[var(--muted)]">
              <strong>Common codes:</strong> USA, GBR, DEU, FRA, JPN, CHN, IND, BRA, AUS, CAN, RUS, KOR, MEX, ARG, ZAF, NGA, IDN, ITA, ESP, TUR
            </p>
          </div>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "ChoroplethDatum[] | DataRow[]", default: "[]", description: "Region data: { id, value } or flat rows with idField + valueField." },
              { prop: "features", type: "GeoJSON Feature[]", default: "(required)", description: "GeoJSON features array. Use worldFeatures from MetricUI or your own." },
              { prop: "idField", type: "string", default: '"id"', description: "Column name for region code (flat format)." },
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
              { prop: "scaleType", type: '"linear" | "log" | "sqrt"', default: '"linear"', description: "Color scale distribution. Use \"sqrt\" or \"log\" for skewed data like population." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration." },
              { prop: "tooltipLabel", type: "string", default: "valueField name", description: "Label for the value in tooltips (e.g. \"Population\", \"Revenue\")." },
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
              "MetricUI bundles worldFeatures (110m world countries). Import it directly: import { worldFeatures } from \"metricui\".",
              "Feature IDs are ISO 3166-1 alpha-3 codes (\"USA\", \"GBR\", \"HND\", etc.) — the standard 3-letter country codes.",
              "For US state maps or other regions, provide your own GeoJSON from world-atlas, us-atlas, or natural-earth-vector.",
              "Use the domain prop to set explicit color scale boundaries. Auto-computed from data min/max if omitted.",
              "Flat DataRow[] format uses idField and valueField to extract region codes and values.",
              "Built on @nivo/geo — all Nivo theming and tooltip conventions apply.",
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
