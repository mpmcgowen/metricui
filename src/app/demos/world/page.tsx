"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { BarChart } from "@/components/charts/BarChart";
import { BarLineChart } from "@/components/charts/BarLineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { DataTable } from "@/components/tables/DataTable";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricProvider } from "@/lib/MetricProvider";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { FilterTags } from "@/components/filters/FilterTags";
import { countries } from "@/data/world";
import type { Country } from "@/data/world";
import {
  Globe,
  Users,
  Languages,
  Coins,
  Landmark,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Derived Data
// ---------------------------------------------------------------------------

function deriveData(allCountries: Country[]) {
  const totalPopulation = allCountries.reduce((s, c) => s + c.population, 0);
  const totalArea = allCountries.reduce((s, c) => s + c.area, 0);

  // --- Region stats ---
  const regionMap = new Map<
    string,
    { population: number; count: number; area: number }
  >();
  for (const c of allCountries) {
    const r = c.region || "Other";
    const prev = regionMap.get(r) ?? { population: 0, count: 0, area: 0 };
    regionMap.set(r, {
      population: prev.population + c.population,
      count: prev.count + 1,
      area: prev.area + c.area,
    });
  }

  const populationByRegion = [...regionMap.entries()]
    .filter(([r]) => r !== "Antarctic")
    .sort((a, b) => b[1].population - a[1].population)
    .map(([region, d]) => ({
      region,
      population: d.population,
      countries: d.count,
    }));

  // --- Subregion population for heatmap-style area chart ---
  const subregionMap = new Map<
    string,
    { population: number; region: string }
  >();
  for (const c of allCountries) {
    if (!c.subregion) continue;
    const prev = subregionMap.get(c.subregion) ?? {
      population: 0,
      region: c.region,
    };
    subregionMap.set(c.subregion, {
      population: prev.population + c.population,
      region: c.region,
    });
  }

  const subregionData = [...subregionMap.entries()]
    .sort((a, b) => b[1].population - a[1].population)
    .slice(0, 15)
    .map(([subregion, d]) => ({
      subregion,
      population: Math.round(d.population / 1_000_000),
    }));

  // --- Language distribution ---
  const langMap = new Map<string, number>();
  for (const c of allCountries) {
    for (const lang of c.languages) {
      langMap.set(lang, (langMap.get(lang) ?? 0) + 1);
    }
  }
  const languageData = [...langMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([language, count]) => ({ language, countries: count }));

  const totalLanguages = langMap.size;

  // --- Currency distribution ---
  const currMap = new Map<
    string,
    { name: string; count: number; population: number }
  >();
  for (const c of allCountries) {
    for (const cur of c.currencies) {
      const prev = currMap.get(cur.code) ?? {
        name: cur.name,
        count: 0,
        population: 0,
      };
      currMap.set(cur.code, {
        name: cur.name,
        count: prev.count + 1,
        population: prev.population + c.population,
      });
    }
  }
  const currencyData = [...currMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([code, d]) => ({
      currency: `${code}`,
      countries: d.count,
    }));

  const totalCurrencies = currMap.size;

  // --- Population density by region (heatmap) ---
  const densityBySubregionAndMetric = [...subregionMap.entries()]
    .filter(([, d]) => d.population > 1_000_000)
    .sort((a, b) => b[1].population - a[1].population)
    .slice(0, 12)
    .map(([subregion, d]) => {
      const subCountries = allCountries.filter(
        (c) => c.subregion === subregion
      );
      const totalAreaSub = subCountries.reduce((s, c) => s + c.area, 0);
      const density =
        totalAreaSub > 0 ? Math.round(d.population / totalAreaSub) : 0;
      const avgPop = Math.round(
        d.population / Math.max(subCountries.length, 1) / 1_000_000
      );
      return {
        subregion: subregion.length > 20 ? subregion.slice(0, 18) + "…" : subregion,
        density,
        avgPopM: avgPop,
      };
    });

  // --- Top 10 most populous ---
  const top10 = allCountries.slice(0, 10);
  const populationSparkline = top10.map((c) => c.population);

  // --- Region area comparison ---
  const regionAreaData = [...regionMap.entries()]
    .filter(([r]) => r !== "Antarctic")
    .sort((a, b) => b[1].area - a[1].area)
    .map(([region, d]) => ({
      region,
      area: Math.round(d.area),
      population: Math.round(d.population / 1_000_000),
    }));

  // --- Country table data ---
  const tableData = allCountries.slice(0, 100).map((c) => ({
    name: c.name,
    capital: c.capital || "—",
    region: c.region,
    subregion: c.subregion || "—",
    population: c.population,
    area: c.area,
    density: c.area > 0 ? Math.round(c.population / c.area) : 0,
    languages: c.languages.slice(0, 3).join(", "),
    currency: c.currencies[0]?.code ?? "—",
    flag: c.flag,
  }));

  return {
    totalPopulation,
    totalArea,
    totalLanguages,
    totalCurrencies,
    populationByRegion,
    subregionData,
    languageData,
    currencyData,
    densityBySubregionAndMetric,
    top10,
    populationSparkline,
    regionAreaData,
    tableData,
  };
}

// ---------------------------------------------------------------------------
// Cross-filtered country table
// ---------------------------------------------------------------------------

function CountryTable({ data, tableView }: {
  data: ReturnType<typeof deriveData>["tableData"];
  tableView: string;
}) {
  return (
    <DataTable
      data={data as never[]}
      columns={
        [
          {
            key: "name" as const,
            header: "Country",
            sortable: true,
            pin: "left" as const,
            render: (val: unknown, row: Record<string, unknown>) => (
              <span className="flex items-center gap-2">
                {Boolean(row.flag) && (
                  <img
                    src={String(row.flag)}
                    alt=""
                    className="h-4 w-6 rounded-sm object-cover"
                  />
                )}
                <span className="font-medium">{String(val)}</span>
              </span>
            ),
          },
          {
            key: "capital" as const,
            header: "Capital",
            width: 140,
          },
          {
            key: "region" as const,
            header: "Region",
            type: "badge" as const,
            width: 100,
            badgeColor: (v: unknown) => {
              const colors: Record<string, string> = {
                Africa: "#f59e0b",
                Americas: "#3b82f6",
                Asia: "#ef4444",
                Europe: "#8b5cf6",
                Oceania: "#10b981",
              };
              return colors[String(v)] ?? "#6b7280";
            },
          },
          {
            key: "population" as const,
            header: "Population",
            type: "number" as const,
            format: "compact" as const,
            sortable: true,
            width: 120,
          },
          {
            key: "area" as const,
            header: "Area (km²)",
            type: "number" as const,
            format: "compact" as const,
            sortable: true,
            width: 110,
          },
          {
            key: "density" as const,
            header: "Density",
            type: "number" as const,
            sortable: true,
            width: 90,
            conditions: [
              { when: "above" as const, value: 500, color: "red" },
              {
                when: "between" as const,
                min: 100,
                max: 500,
                color: "amber",
              },
              { when: "below" as const, value: 100, color: "emerald" },
            ],
          },
          {
            key: "languages" as const,
            header: "Languages",
            width: 160,
          },
          {
            key: "currency" as const,
            header: "Currency",
            width: 90,
          },
        ] as never[]
      }
      title={`${tableView === "Top 100" ? "Top 100 Countries" : tableView} (${data.length})`}
      subtitle="Sorted by population — click headers to sort"
      pageSize={15}
      dense
      searchable
      multiSort
      striped
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DashboardContent() {
  const cf = useCrossFilter();
  const [tableView, setTableView] = useState<string>("Top 100");

  // Filter countries by cross-filter (region from bar chart)
  const filteredCountries = useMemo(() => {
    if (!cf?.isActive || cf.selection?.field !== "region") return countries;
    return countries.filter((c) => c.region === cf.selection!.value);
  }, [cf?.isActive, cf?.selection]);

  // Re-derive all data from filtered countries
  const allData = useMemo(() => deriveData(countries), []);
  const data = useMemo(() => deriveData(filteredCountries), [filteredCountries]);

  // Population by region always shows full data (it's the cross-filter source)
  const populationByRegion = allData.populationByRegion;

  const filteredTable = useMemo(() => {
    if (tableView === "Top 100") return data.tableData;
    return data.tableData.filter((c) => c.region === tableView);
  }, [tableView, data.tableData]);

  return (
    <>
          <div className="mt-4">
            <FilterTags showCrossFilter crossFilterLabels={{ region: "Region" }} />
          </div>
          <MetricGrid className="mt-6">
            {/* ── Global Overview ── */}
            <SectionHeader
              title="Global Overview"
              subtitle={cf?.isActive ? `Filtered by ${cf.selection?.field}: ${cf.selection?.value}` : undefined}
              description="Key metrics across all 245 countries — population, language diversity, and currency coverage"
            />

            <KpiCard
              title="World Population"
              value={data.totalPopulation}
              format="compact"
              icon={<Users className="h-3.5 w-3.5" />}
              sparkline={{ data: data.populationSparkline, type: "bar" }}
              description={({ formatted }) => `${formatted.value} people across ${filteredCountries.length} countries. Sparkline shows the top 10 most populous nations.`}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Countries"
              value={filteredCountries.length}
              format="number"
              icon={<Globe className="h-3.5 w-3.5" />}
              description="Sovereign nations and dependent territories recognized by the REST Countries API."
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Languages"
              value={data.totalLanguages}
              format="number"
              icon={<Languages className="h-3.5 w-3.5" />}
              description="Distinct official and recognized languages across all countries. Many nations have multiple official languages."
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Currencies"
              value={data.totalCurrencies}
              format="number"
              icon={<Coins className="h-3.5 w-3.5" />}
              description={({ value }) => `${value} unique currencies in circulation. Some currencies like the Euro are shared across many nations.`}
              animate={{ countUp: true, delay: 300 }}
            />

            <StatGroup
              stats={data.populationByRegion.map((r) => ({
                label: r.region,
                value: r.population,
                format: "compact" as const,
                description: `${r.countries} countries`,
              }))}
              dense
            />

            {/* ── Population ── */}
            <SectionHeader
              title="Population Distribution"
              description="Regional population breakdown — click a bar to cross-filter the entire dashboard"
              border
            />

            <BarChart
              data={populationByRegion}
              index="region"
              categories={["population"]}
              title="Population by Region"
              subtitle="Total population per continent"
              description="Click a bar to filter the entire dashboard by that region."
              format="compact"
              height={320}
              crossFilter
            />

            {/* ── Languages ── */}
            <SectionHeader
              title="Language Distribution"
              description="Top 10 languages by number of countries where they are officially spoken"
              border
            />

            <DonutChart
              data={data.languageData}
              index="language"
              categories={["countries"]}
              title="Most Spoken Languages"
              subtitle="By number of countries"
              description="Top 10 languages ranked by number of countries where they are an official language."
              height={340}
              showPercentage
              innerRadius={0.6}
              centerValue={`${data.totalLanguages}`}
              centerLabel="Total"
            />

            {/* ── Geography ── */}
            <SectionHeader
              title="Geography & Density"
              description="Land area vs population density — the dual-axis chart reveals how regions compare on both dimensions"
              border
            />

            <BarLineChart
              data={allData.regionAreaData}
              index="region"
              categories={[
                { key: "area", label: "Land Area (km²)", format: "compact" },
                { key: "population", label: "Population (M)", format: "compact", axis: "right" },
              ]}
              title="Region Comparison"
              subtitle="Bars = land area, line = population (millions)"
              description="Click a bar to cross-filter. Dual-axis: bars = area, line = population."
              height={320}
              legend
              crossFilter
            />
            <BarChart
              preset="horizontal"
              data={data.densityBySubregionAndMetric}
              index="subregion"
              categories={["density"]}
              sort="desc"
              title="Population Density"
              subtitle="People per km² by subregion"
              format="number"
              height={380}
            />

            {/* ── Top Countries ── */}
            <SectionHeader
              title="Top Countries by Population"
              description="The 10 most populous nations and their outsized share of global population"
              border
            />

            <Callout
              variant="info"
              title="Population Leaders"
              icon={<Landmark className="h-5 w-5" />}
              dense
            >
              India ({(data.top10[0]?.population / 1e9).toFixed(2)}B) and China
              ({(data.top10[1]?.population / 1e9).toFixed(2)}B) together account
              for{" "}
              {Math.round(
                ((data.top10[0]?.population + data.top10[1]?.population) /
                  data.totalPopulation) *
                  100
              )}
              % of the world population.
            </Callout>

            <BarChart
              data={data.top10.map((c) => ({
                country: c.name,
                population: c.population,
              }))}
              index="country"
              categories={["population"]}
              title="Top 10 Most Populous"
              format="compact"
              height={300}
            />

            {/* ── Country Details Table ── */}
            <SectionHeader
              title="Country Directory"
              description="Sortable, searchable table of countries — filter by region with the toggle or cross-filter from charts above"
              border
              action={
                <SegmentToggle
                  options={[
                    { value: "Top 100", label: "Top 100" },
                    { value: "Africa", label: "Africa" },
                    { value: "Americas", label: "Americas" },
                    { value: "Asia", label: "Asia" },
                    { value: "Europe", label: "Europe" },
                    { value: "Oceania", label: "Oceania" },
                  ]}
                  value={tableView}
                  onChange={(v) => setTableView(v as string)}
                  size="sm"
                />
              }
            />

            <CountryTable
              data={filteredTable}
              tableView={tableView}
            />
          </MetricGrid>
    </>
  );
}

export default function WorldDashboard() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
        <div className="mt-4">
          <DashboardHeader
            title="World Data Explorer"
            subtitle="Population, languages, currencies & geography — 245 countries from REST Countries API"
            back={{ href: "/docs/kpi-card", label: "Docs" }}
            variant="flat"
          />
        </div>
        <MetricProvider theme="cyan" variant="ghost">
          <CrossFilterProvider>
            <DashboardContent />
          </CrossFilterProvider>
        </MetricProvider>
      </div>
    </div>
  );
}
