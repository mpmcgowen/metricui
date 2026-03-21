"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { BarChart } from "@/components/charts/BarChart";
import { BarLineChart } from "@/components/charts/BarLineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MetricProvider } from "@/lib/MetricProvider";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { countries } from "@/data/world";
import type { Country } from "@/data/world";
import { cn } from "@/lib/utils";
import {
  Globe,
  Users,
  Languages,
  Coins,
  MapPin,
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
// Component
// ---------------------------------------------------------------------------

export default function WorldDashboard() {
  const data = useMemo(() => deriveData(countries), []);
  const [tableView, setTableView] = useState<string>("Top 100");

  const filteredTable = useMemo(() => {
    if (tableView === "Top 100") return data.tableData;
    return data.tableData.filter((c) => c.region === tableView);
  }, [tableView, data.tableData]);

  // Region population as percentage for sparklines
  const regionPopPcts = useMemo(
    () =>
      data.populationByRegion.map((r) =>
        Math.round((r.population / data.totalPopulation) * 100)
      ),
    [data]
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Theme Toggle */}
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="mt-4">
          <DashboardHeader
            title="World Data Explorer"
            subtitle="Population, languages, currencies & geography — 245 countries from REST Countries API"
            back={{ href: "/docs/kpi-card", label: "Docs" }}
            variant="flat"
          />
        </div>

        <MetricProvider variant="outlined">
          <MetricGrid className="mt-6">
            {/* ── Global Overview ── */}
            <MetricGrid.Section title="Global Overview" />

            <KpiCard
              title="World Population"
              value={data.totalPopulation}
              format="compact"
              icon={<Users className="h-3.5 w-3.5" />}
              sparkline={{ data: data.populationSparkline, type: "bar" }}
              description="Top 10 countries by population"
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Countries"
              value={countries.length}
              format="number"
              icon={<Globe className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Languages"
              value={data.totalLanguages}
              format="number"
              icon={<Languages className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Currencies"
              value={data.totalCurrencies}
              format="number"
              icon={<Coins className="h-3.5 w-3.5" />}
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
            <MetricGrid.Section title="Population Distribution" border />

            <BarChart
              data={data.populationByRegion}
              index="region"
              categories={["population"]}
              title="Population by Region"
              subtitle="Total population per continent"
              format="compact"
              height={320}
            />
            <BarChart
              preset="horizontal"
              data={data.subregionData}
              index="subregion"
              categories={["population"]}
              sort="desc"
              title="Top Subregions"
              subtitle="Population in millions"
              format="number"
              height={420}
            />

            {/* ── Languages & Currencies ── */}
            <MetricGrid.Section title="Languages & Currencies" border />

            <DonutChart
              data={data.languageData}
              index="language"
              categories={["countries"]}
              title="Most Spoken Languages"
              subtitle="By number of countries"
              height={340}
              showPercentage
              innerRadius={0.6}
              centerValue={`${data.totalLanguages}`}
              centerLabel="Total"
            />
            <DonutChart
              data={data.currencyData}
              index="currency"
              categories={["countries"]}
              title="Most Used Currencies"
              subtitle="By number of countries"
              height={340}
              showPercentage
              innerRadius={0.6}
              centerValue={`${data.totalCurrencies}`}
              centerLabel="Total"
            />

            {/* ── Geography ── */}
            <MetricGrid.Section title="Geography & Density" border />

            <BarLineChart
              data={data.regionAreaData}
              index="region"
              categories={[
                { key: "area", label: "Land Area (km²)", format: "compact" },
                { key: "population", label: "Population (M)", format: "compact", axis: "right" },
              ]}
              title="Region Comparison"
              subtitle="Bars = land area, line = population (millions)"
              height={320}
              legend
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
            <MetricGrid.Section title="Top Countries by Population" border />

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
            <MetricGrid.Section
              title="Country Directory"
              border
              badge={
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

            <DataTable
              data={filteredTable as never[]}
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
              title={`${tableView === "Top 100" ? "Top 100 Countries" : tableView} (${filteredTable.length})`}
              subtitle="Sorted by population — click headers to sort"
              pageSize={15}
              dense
              searchable
              multiSort
              striped
            />
          </MetricGrid>
        </MetricProvider>
      </div>
    </div>
  );
}
