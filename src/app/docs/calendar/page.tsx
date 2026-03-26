"use client";

import { Calendar } from "@/components/charts/Calendar";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-colors", title: "Custom Colors", level: 2 },
  { id: "vertical", title: "Vertical Direction", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Generate 365 days of sample data (daily revenue)
// ---------------------------------------------------------------------------

function generateCalendarData(year: number) {
  const data: { day: string; value: number }[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 800 : 2400;
    const variance = Math.floor(Math.random() * 1600) - 800;
    // Use a seeded-ish pattern so it looks realistic
    const monthBoost = current.getMonth() >= 9 ? 600 : 0; // Q4 bump
    const value = Math.max(0, base + variance + monthBoost);

    data.push({
      day: current.toISOString().slice(0, 10),
      value,
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

const dailyRevenue = generateCalendarData(2025);

const commitData = [
  { day: "2025-01-05", value: 3 },
  { day: "2025-01-06", value: 12 },
  { day: "2025-01-07", value: 8 },
  { day: "2025-01-08", value: 15 },
  { day: "2025-01-09", value: 6 },
  { day: "2025-01-10", value: 2 },
  { day: "2025-01-13", value: 11 },
  { day: "2025-01-14", value: 9 },
  { day: "2025-01-15", value: 18 },
  { day: "2025-01-16", value: 7 },
  { day: "2025-01-17", value: 4 },
  { day: "2025-01-20", value: 14 },
  { day: "2025-01-21", value: 10 },
  { day: "2025-01-22", value: 22 },
  { day: "2025-01-23", value: 5 },
  { day: "2025-01-24", value: 1 },
  { day: "2025-01-27", value: 16 },
  { day: "2025-01-28", value: 13 },
  { day: "2025-01-29", value: 19 },
  { day: "2025-01-30", value: 8 },
  { day: "2025-01-31", value: 3 },
  { day: "2025-02-03", value: 10 },
  { day: "2025-02-04", value: 7 },
  { day: "2025-02-05", value: 21 },
  { day: "2025-02-06", value: 14 },
  { day: "2025-02-07", value: 6 },
  { day: "2025-02-10", value: 9 },
  { day: "2025-02-11", value: 17 },
  { day: "2025-02-12", value: 12 },
  { day: "2025-02-13", value: 4 },
  { day: "2025-02-14", value: 8 },
];

export default function CalendarDocs() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Calendar</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            A calendar heatmap that shows daily values over time. Each cell represents one day,
            colored by intensity. Ideal for spotting patterns in daily activity data.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Calendar for daily time-series data — commit activity, daily revenue, support tickets,
          or any metric that varies day-by-day. For aggregated time-series, use{" "}
          <a href="/docs/area-chart" className="font-medium text-[var(--accent)] hover:underline">
            AreaChart
          </a>{" "}
          or{" "}
          <a href="/docs/heatmap" className="font-medium text-[var(--accent)] hover:underline">
            HeatMap
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<Calendar
  data={dailyRevenue}
  from="2025-01-01"
  to="2025-12-31"
  title="Daily Revenue — 2025"
  format="currency"
  height={200}
/>`}
          >
            <div className="w-full">
              <Calendar
                data={dailyRevenue}
                from="2025-01-01"
                to="2025-12-31"
                title="Daily Revenue — 2025"
                format="currency"
                height={200}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Colors */}
        <DocSection id="custom-colors" title="Custom Colors">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">colors</code> array
            to define the sequential color scale. Lower values map to the first color, higher to the last.
          </p>
          <ComponentExample
            code={`<Calendar
  data={commitData}
  from="2025-01-01"
  to="2025-02-28"
  title="Commit Activity"
  format="number"
  colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
  emptyColor="#161b22"
  height={160}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Calendar
                data={commitData}
                from="2025-01-01"
                to="2025-02-28"
                title="Commit Activity"
                format="number"
                colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
                emptyColor="#161b22"
                height={160}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Vertical */}
        <DocSection id="vertical" title="Vertical Direction">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">direction=&quot;vertical&quot;</code> for
            a top-to-bottom layout. Useful in narrow sidebars or tall panels.
          </p>
          <ComponentExample
            code={`<Calendar
  data={commitData}
  from="2025-01-01"
  to="2025-02-28"
  title="Vertical Calendar"
  direction="vertical"
  format="number"
  height={400}
/>`}
          >
            <div className="w-full max-w-md">
              <Calendar
                data={commitData}
                from="2025-01-01"
                to="2025-02-28"
                title="Vertical Calendar"
                direction="vertical"
                format="number"
                height={400}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "CalendarDatum[] | DataRow[]", default: "[]", description: "Array of { day, value } or flat rows with dateField + valueField." },
              { prop: "dateField", type: "string", default: "—", description: "Column name for the date when using flat rows." },
              { prop: "valueField", type: "string", default: "—", description: "Column name for the value when using flat rows." },
              { prop: "from", type: "string", default: "auto", description: "Start date (YYYY-MM-DD). Auto-derived from data if omitted." },
              { prop: "to", type: "string", default: "auto", description: "End date (YYYY-MM-DD). Auto-derived from data if omitted." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "height", type: "number", default: "200", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Sequential color scale for cells." },
              { prop: "emptyColor", type: "string", default: "theme default", description: "Color for days with no data." },
              { prop: "format", type: "FormatOption", default: "—", description: "Value format for tooltips." },
              { prop: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Calendar layout direction." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering on day click." },
              { prop: "drillDown", type: "true | function", default: "—", description: "true for auto table, or custom render function." },
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
              "Data must include { day: 'YYYY-MM-DD', value: number } entries. Missing days render with emptyColor.",
              "The from/to range controls which months are rendered. Auto-derived from data if omitted.",
              "Horizontal direction (default) flows left-to-right with months as columns. Vertical flows top-to-bottom.",
              "Colors are applied as a sequential scale — provide 3-5 color stops for best results.",
              "Built on @nivo/calendar — all Nivo theming and tooltip conventions apply.",
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
            {["HeatMap", "AreaChart", "LineChart", "BarChart"].map((name) => (
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

      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
