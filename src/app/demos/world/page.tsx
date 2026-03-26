"use client";

import { useMemo } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { BarChart } from "@/components/charts/BarChart";
import { BarLineChart } from "@/components/charts/BarLineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { DataTable } from "@/components/tables/DataTable";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Dashboard } from "@/components/layout/Dashboard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DashboardInsight } from "@/components/ui/DashboardInsight";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useMetricFilters } from "@/lib/FilterContext";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { FilterBar } from "@/components/filters/FilterBar";
import { useDrillDownAction } from "@/components/ui/DrillDown";
import { formatValue } from "@/lib/format";
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
      data={data }
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
        ]      }
      title={`${tableView === "All" ? "All Countries" : tableView} (${data.length})`}
      subtitle="Sorted by population — click a row for country details"
      pageSize={15}
      dense
      searchable
      multiSort
      striped
      drillDown={(row) => {
        const countryName = String(row.name);
        const country = countries.find((c) => c.name === countryName);
        if (!country) return <div>Country not found</div>;
        return <CountryDetail country={country} />;
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Country detail — level 3/4 drill with drillable languages
// ---------------------------------------------------------------------------

function CountryDetail({ country }: { country: Country }) {
  const openDrill = useDrillDownAction();
  const density = country.area > 0 ? Math.round(country.population / country.area) : 0;

  return (
    <MetricGrid>
      <KpiCard title="Population" value={country.population} format="compact" icon={<Users className="h-3.5 w-3.5" />} />
      <KpiCard title="Area" value={country.area} format={{ style: "custom", suffix: " km\u00B2" }} />
      <KpiCard title="Density" value={density} format={{ style: "custom", suffix: " /km\u00B2" }} />
      <StatGroup
        stats={[
          { label: "Capital", value: country.capital || "\u2014" },
          { label: "Region", value: country.region },
          { label: "Subregion", value: country.subregion || "\u2014" },
        ]}
        dense
      />
      {/* Drillable languages — click a language to see all countries that speak it (level 4) */}
      <DataTable
        data={country.languages.map((lang) => {
          const speakingCountries = countries.filter((c) => c.languages.includes(lang));
          return { language: lang, countries: speakingCountries.length };
        }) }
        columns={[
          { key: "language", header: "Language", sortable: true },
          { key: "countries", header: "Countries Speaking", format: "number" as const, sortable: true, align: "right" as const },
        ] }
        title={`Languages (${country.languages.length})`}
        dense
        drillDown={(row) => {
          const lang = String(row.language);
          const langCountries = countries.filter((c) => c.languages.includes(lang));
          return (
            <MetricGrid>
              <KpiCard title="Countries" value={langCountries.length} format="number" />
              <KpiCard title="Total Population" value={langCountries.reduce((s, c) => s + c.population, 0)} format="compact" />
              <DataTable
                data={langCountries.map((c) => ({
                  name: c.name,
                  region: c.region,
                  population: c.population,
                  capital: c.capital || "\u2014",
                  flag: c.flag,
                })) }
                columns={[
                  { key: "name", header: "Country", sortable: true, render: (val: unknown, r: Record<string, unknown>) => (
                    <span className="flex items-center gap-2">
                      {Boolean(r.flag) && <img src={String(r.flag)} alt="" className="h-4 w-6 rounded-sm object-cover" />}
                      <span className="font-medium">{String(val)}</span>
                    </span>
                  ) },
                  { key: "capital", header: "Capital" },
                  { key: "region", header: "Region", sortable: true },
                  { key: "population", header: "Population", format: "compact" as const, sortable: true, align: "right" as const },
                ] }
                title={`Countries with ${lang}`}
                pageSize={15}
                dense
                searchable
              />
            </MetricGrid>
          );
        }}
      />
      <DataTable
        data={country.currencies.map((c) => ({ code: c.code, name: c.name, symbol: c.symbol })) }
        columns={[
          { key: "code", header: "Code" },
          { key: "name", header: "Currency" },
          { key: "symbol", header: "Symbol" },
        ] }
        title={`Currencies (${country.currencies.length})`}
        dense
      />
    </MetricGrid>
  );
}

// ---------------------------------------------------------------------------
// Nested drill components — must be separate to call useDrillDownAction()
// ---------------------------------------------------------------------------

function SubregionDrill({ region, allCountries }: { region: string; allCountries: Country[] }) {
  const openDrill = useDrillDownAction();
  const regionCountries = allCountries.filter((c) => c.region === region);

  const subregionData = useMemo(() => {
    const map = new Map<string, { population: number; count: number }>();
    for (const c of regionCountries) {
      if (!c.subregion) continue;
      const prev = map.get(c.subregion) ?? { population: 0, count: 0 };
      map.set(c.subregion, { population: prev.population + c.population, count: prev.count + 1 });
    }
    return [...map.entries()]
      .sort((a, b) => b[1].population - a[1].population)
      .map(([subregion, d]) => ({ subregion, population: d.population, countries: d.count }));
  }, [regionCountries]);

  return (
    <MetricGrid>
      <KpiCard title="Countries" value={regionCountries.length} format="number" />
      <KpiCard title="Population" value={regionCountries.reduce((s, c) => s + c.population, 0)} format="compact" />
      <KpiCard title="Subregions" value={subregionData.length} format="number" />
      <BarChart
        data={subregionData.map((d) => ({ subregion: d.subregion, population: d.population }))}
        index="subregion"
        categories={["population"]}
        title={`Subregions of ${region}`}
        subtitle="Click a bar to drill deeper"
        format="compact"
        height={300}
        sort="desc"
        layout="horizontal"
        drillDown={(event) => {
          const subregion = String(event.indexValue);
          const subCountries = regionCountries.filter((c) => c.subregion === subregion);
          return (
            <MetricGrid>
              <KpiCard title="Countries" value={subCountries.length} format="number" />
              <KpiCard title="Population" value={subCountries.reduce((s, c) => s + c.population, 0)} format="compact" />
              <DataTable
                data={subCountries.map((c) => ({
                  name: c.name,
                  capital: c.capital || "\u2014",
                  population: c.population,
                  area: c.area,
                  languages: c.languages.slice(0, 3).join(", "),
                  flag: c.flag,
                })) }
                columns={[
                  { key: "name", header: "Country", sortable: true, render: (val: unknown, row: Record<string, unknown>) => (
                    <span className="flex items-center gap-2">
                      {Boolean(row.flag) && <img src={String(row.flag)} alt="" className="h-4 w-6 rounded-sm object-cover" />}
                      <span className="font-medium">{String(val)}</span>
                    </span>
                  ) },
                  { key: "capital", header: "Capital" },
                  { key: "population", header: "Population", format: "compact" as const, sortable: true, align: "right" as const },
                  { key: "area", header: "Area (km\u00B2)", format: "compact" as const, sortable: true, align: "right" as const },
                  { key: "languages", header: "Languages" },
                ]}
                title={`${subregion} Countries`}
                pageSize={15}
                dense
                searchable
              />
            </MetricGrid>
          );
        }}
      />
      <DataTable
        data={regionCountries.map((c) => ({
          name: c.name,
          subregion: c.subregion || "\u2014",
          population: c.population,
          area: c.area,
          languages: c.languages.slice(0, 3).join(", "),
          flag: c.flag,
        })) }
        columns={[
          { key: "name", header: "Country", sortable: true, render: (val: unknown, row: Record<string, unknown>) => (
            <span className="flex items-center gap-2">
              {Boolean(row.flag) && <img src={String(row.flag)} alt="" className="h-4 w-6 rounded-sm object-cover" />}
              <span className="font-medium">{String(val)}</span>
            </span>
          ) },
          { key: "subregion", header: "Subregion", sortable: true },
          { key: "population", header: "Population", format: "compact" as const, sortable: true, align: "right" as const },
          { key: "area", header: "Area (km\u00B2)", format: "compact" as const, sortable: true, align: "right" as const },
          { key: "languages", header: "Languages" },
        ]}
        title={`All ${region} Countries`}
        pageSize={10}
        dense
        searchable
      />
    </MetricGrid>
  );
}

function DashboardContent() {
  const cf = useCrossFilter();
  const filters = useMetricFilters();
  const openDrill = useDrillDownAction();
  const tableView = filters?.dimensions?.tableView?.[0] ?? "All";

  // Filter countries by segment toggle + cross-filter
  const filteredCountries = useMemo(() => {
    let result = countries;
    if (tableView !== "All") {
      result = result.filter((c) => c.region === tableView);
    }
    if (cf?.isActive && cf.selection?.field === "region") {
      result = result.filter((c) => c.region === cf.selection!.value);
    }
    return result;
  }, [tableView, cf?.isActive, cf?.selection]);

  // Re-derive all data from filtered countries
  const allData = useMemo(() => deriveData(countries), []);
  const data = useMemo(() => deriveData(filteredCountries), [filteredCountries]);

  // Population by region always shows full data (it's the cross-filter source)
  const populationByRegion = allData.populationByRegion;

  const filteredTable = useMemo(() => {
    if (tableView === "All") return data.tableData;
    return data.tableData.filter((c) => c.region === tableView);
  }, [tableView, data.tableData]);

  return (
    <>
          <FilterBar
            sticky
            tags={{ showCrossFilter: true, crossFilterLabels: { region: "Region" } }}
            collapsible={false}
            className="mt-4"
          >
            <SegmentToggle
              options={[
                { value: "All", label: "All" },
                { value: "Africa", label: "Africa" },
                { value: "Americas", label: "Americas" },
                { value: "Asia", label: "Asia" },
                { value: "Europe", label: "Europe" },
                { value: "Oceania", label: "Oceania" },
              ]}
              defaultValue="All"
              field="tableView"
              size="sm"
            />
          </FilterBar>
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
              aiContext="India and China hold ~36% of world population. GDP-population inversion is common — smallest countries often have highest GDP per capita."
              drillDown={{
                label: "Top countries by population",
                onClick: () => openDrill(
                  { title: `World Population: ${formatValue(data.totalPopulation, "compact")}`, field: "population" },
                  <MetricGrid>
                    <KpiCard title="Total Population" value={data.totalPopulation} format="compact" />
                    <KpiCard title="Countries" value={filteredCountries.length} format="number" />
                    <KpiCard title="Avg Population" value={filteredCountries.length > 0 ? Math.round(data.totalPopulation / filteredCountries.length) : 0} format="compact" />
                    <DataTable
                      data={data.top10.map((c) => ({
                        name: c.name,
                        population: c.population,
                        area: c.area,
                        density: c.area > 0 ? Math.round(c.population / c.area) : 0,
                        region: c.region,
                        flag: c.flag,
                      })) }
                      columns={[
                        { key: "name", header: "Country", sortable: true, render: (val: unknown, row: Record<string, unknown>) => (
                          <span className="flex items-center gap-2">
                            {Boolean(row.flag) && <img src={String(row.flag)} alt="" className="h-4 w-6 rounded-sm object-cover" />}
                            <span className="font-medium">{String(val)}</span>
                          </span>
                        ) },
                        { key: "population", header: "Population", format: "compact" as const, sortable: true, align: "right" as const },
                        { key: "area", header: "Area (km\u00B2)", format: "compact" as const, sortable: true, align: "right" as const },
                        { key: "density", header: "Density", format: "number" as const, sortable: true, align: "right" as const },
                        { key: "region", header: "Region", sortable: true },
                      ]}
                      title="Top 10 Countries by Population"
                      pageSize={10}
                      dense
                    />
                  </MetricGrid>,
                ),
              }}
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
              aiContext="English is official in 60+ countries but Mandarin has more native speakers. Africa has the highest linguistic diversity per country."
              drillDown={{
                label: "Language distribution",
                onClick: () => {
                  const langMap = new Map<string, number>();
                  for (const c of filteredCountries) {
                    for (const lang of c.languages) langMap.set(lang, (langMap.get(lang) ?? 0) + 1);
                  }
                  const langData = [...langMap.entries()].sort((a, b) => b[1] - a[1]);
                  const topLangs = langData.slice(0, 12).map(([id, value]) => ({ id, label: id, value }));
                  const langTable = langData.slice(0, 30).map(([language, count]) => ({ language, countries: count }));
                  openDrill(
                    { title: `${data.totalLanguages} Languages`, field: "languages" },
                    <MetricGrid>
                      <KpiCard title="Total Languages" value={data.totalLanguages} format="number" />
                      <KpiCard title="Most Common" value={langData[0]?.[0] ?? "\u2014"} format={{ style: "custom" }} />
                      <KpiCard title="Top Language Countries" value={langData[0]?.[1] ?? 0} format="number" />
                      <DonutChart
                        data={topLangs}
                        title="Top 12 Languages"
                        subtitle="By number of countries"
                        showPercentage
                        innerRadius={0.6}
                        height={300}
                      />
                      <DataTable
                        data={langTable }
                        columns={[
                          { key: "language", header: "Language", sortable: true },
                          { key: "countries", header: "Countries", format: "number" as const, sortable: true, align: "right" as const },
                        ]}
                        title="Languages by Country Count"
                        pageSize={15}
                        dense
                        searchable
                      />
                    </MetricGrid>,
                  );
                },
              }}
            />
            <KpiCard
              title="Currencies"
              value={data.totalCurrencies}
              format="number"
              icon={<Coins className="h-3.5 w-3.5" />}
              description={({ value }) => `${value} unique currencies in circulation. Some currencies like the Euro are shared across many nations.`}
              animate={{ countUp: true, delay: 300 }}
              drillDown={{
                label: "Currency distribution",
                onClick: () => {
                  const currMap = new Map<string, { name: string; count: number }>();
                  for (const c of filteredCountries) {
                    for (const cur of c.currencies) {
                      const prev = currMap.get(cur.code) ?? { name: cur.name, count: 0 };
                      currMap.set(cur.code, { name: cur.name, count: prev.count + 1 });
                    }
                  }
                  const currData = [...currMap.entries()].sort((a, b) => b[1].count - a[1].count);
                  const topCurr = currData.slice(0, 12).map(([code, d]) => ({ id: code, label: `${code} (${d.name})`, value: d.count }));
                  const currTable = currData.slice(0, 30).map(([code, d]) => ({ code, name: d.name, countries: d.count }));
                  openDrill(
                    { title: `${data.totalCurrencies} Currencies`, field: "currencies" },
                    <MetricGrid>
                      <KpiCard title="Total Currencies" value={data.totalCurrencies} format="number" />
                      <KpiCard title="Most Used" value={currData[0]?.[0] ?? "\u2014"} format={{ style: "custom" }} />
                      <KpiCard title="Top Currency Countries" value={currData[0]?.[1]?.count ?? 0} format="number" />
                      <DonutChart
                        data={topCurr}
                        title="Top 12 Currencies"
                        subtitle="By number of countries"
                        showPercentage
                        innerRadius={0.6}
                        height={300}
                      />
                      <DataTable
                        data={currTable }
                        columns={[
                          { key: "code", header: "Code", sortable: true },
                          { key: "name", header: "Currency Name", sortable: true },
                          { key: "countries", header: "Countries", format: "number" as const, sortable: true, align: "right" as const },
                        ]}
                        title="Currencies by Country Count"
                        pageSize={15}
                        dense
                        searchable
                      />
                    </MetricGrid>,
                  );
                },
              }}
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
              subtitle="Total population per continent — click to drill into subregions"
              description="Click a bar to explore subregions. Nested drill: Region -> Subregion -> Countries."
              format="compact"
              height={320}
              aiContext="UN regional groupings. Subregions provide more meaningful comparisons than broad regions. Asia dominates but Southern/Eastern Asia drive the bulk."
              drillDown={(event) => {
                const region = String(event.indexValue);
                return <SubregionDrill region={region} allCountries={filteredCountries} />;
              }}
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
              subtitle="By number of countries — click a slice to see which countries speak it"
              description="Top 10 languages ranked by number of countries where they are an official language."
              height={340}
              aiContext="Counts countries where a language is official, not native speakers. English leads by country count due to colonial history. Arabic spans Africa and Asia."
              showPercentage
              innerRadius={0.6}
              centerValue={`${data.totalLanguages}`}
              centerLabel="Total"
              drillDownMode="modal"
              drillDown={(event) => {
                const lang = event.id;
                const langCountries = filteredCountries.filter((c) => c.languages.includes(lang));
                return (
                  <MetricGrid>
                    <KpiCard title={`${lang} Countries`} value={langCountries.length} format="number" />
                    <KpiCard title="Total Population" value={langCountries.reduce((s, c) => s + c.population, 0)} format="compact" />
                    <DataTable
                      data={langCountries.map((c) => ({
                        name: c.name,
                        region: c.region,
                        population: c.population,
                        capital: c.capital || "\u2014",
                        flag: c.flag,
                      })) }
                      columns={[
                        { key: "name", header: "Country", sortable: true, render: (val: unknown, row: Record<string, unknown>) => (
                          <span className="flex items-center gap-2">
                            {Boolean(row.flag) && <img src={String(row.flag)} alt="" className="h-4 w-6 rounded-sm object-cover" />}
                            <span className="font-medium">{String(val)}</span>
                          </span>
                        ) },
                        { key: "capital", header: "Capital" },
                        { key: "region", header: "Region", sortable: true },
                        { key: "population", header: "Population", format: "compact" as const, sortable: true, align: "right" as const },
                      ]}
                      title={`Countries with ${lang}`}
                      pageSize={15}
                      dense
                      searchable
                    />
                  </MetricGrid>
                );
              }}
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
              aiContext="Area vs population reveals density extremes. Asia has moderate area but massive population. Oceania and Americas have vast area but relatively low density."
              legend
              crossFilter={{ field: "region" }}
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
              aiContext="Density varies wildly within regions. Southern Asia (India, Bangladesh) dwarfs other subregions. City-states like Singapore skew subregion averages upward."
            />

            {/* ── Top Countries ── */}
            <SectionHeader
              title="Top Countries by Population"
              description="The 10 most populous nations and their outsized share of global population"
              border
            />

            {data.top10.length >= 2 && data.totalPopulation > 0 && (
            <Callout
              variant="info"
              title="Population Leaders"
              icon={<Landmark className="h-5 w-5" />}
              dense
            >
              {data.top10[0].name} ({(data.top10[0].population / 1e9).toFixed(2)}B) and {data.top10[1].name}
              ({(data.top10[1].population / 1e9).toFixed(2)}B) together account
              for{" "}
              {Math.round(
                ((data.top10[0].population + data.top10[1].population) /
                  data.totalPopulation) *
                  100
              )}
              % of the world population.
            </Callout>
            )}

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
              description="Sortable, searchable table — use the region toggle in the filter bar above"
              border
            />

            <CountryTable
              data={filteredTable}
              tableView={tableView}
            />
          </MetricGrid>

      {/* ── AI Insights — floating button + sidebar chat ── */}
      <DashboardInsight />
    </>
  );
}

// ---------------------------------------------------------------------------
// AI streaming — Claude via API route
// ---------------------------------------------------------------------------

async function* analyzeWithClaude(messages: { role: string; content: string }[]): AsyncGenerator<string> {
  const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }) });
  if (!response.ok) throw new Error("AI request failed");
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  while (true) { const { done, value } = await reader.read(); if (done) break; yield decoder.decode(value, { stream: true }); }
}

export default function WorldDashboard() {
  return (
    <Dashboard
      theme="cyan"
      variant="ghost"
      exportable
      ai={{
        analyze: analyzeWithClaude as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        stream: true,
        company: "World data explorer — reference dashboard for global statistics.",
        context: "Static dataset of world countries with population, GDP, languages, currencies, and regional groupings. Useful for geographic analysis and cross-country comparisons.",
      }}>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <DashboardHeader
            title="World Data Explorer"
            subtitle="Population, languages, currencies & geography — 245 countries from REST Countries API"
            back={{ href: "/docs/kpi-card", label: "Docs" }}
            variant="flat"
          />
          <DashboardContent />
        </div>
      </div>
    </Dashboard>
  );
}
