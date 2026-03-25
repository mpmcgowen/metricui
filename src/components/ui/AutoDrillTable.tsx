"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { KpiCard } from "@/components/cards/KpiCard";
import type { DataRow } from "@/lib/types";

/**
 * Auto-generated drill-down content. Shows a summary KPI row + a DataTable
 * of the source data filtered to the clicked value.
 *
 * Used internally when `drillDown={true}` on a chart component.
 */
export function AutoDrillTable({
  data,
  field,
  value,
}: {
  data: DataRow[];
  field: string;
  value: string | number;
}) {
  const filtered = useMemo(
    () => data.filter((row) => String(row[field]) === String(value)),
    [data, field, value],
  );

  // Auto-detect columns from the first row
  const columns = useMemo(() => {
    if (filtered.length === 0 && data.length === 0) return [];
    const sample = filtered[0] ?? data[0];
    return Object.keys(sample).map((key) => {
      const sampleVal = sample[key];
      const isNumber = typeof sampleVal === "number";
      return {
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").replace(/_/g, " "),
        sortable: true,
        ...(isNumber ? { format: "number" as const, align: "right" as const } : {}),
      };
    });
  }, [filtered, data]);

  // Auto-detect numeric columns for summary KPIs
  const numericSummary = useMemo(() => {
    if (filtered.length === 0) return [];
    const sample = filtered[0];
    return Object.entries(sample)
      .filter(([k, v]) => typeof v === "number" && k !== field)
      .slice(0, 3)
      .map(([key, _]) => {
        const sum = filtered.reduce((s, row) => s + (Number(row[key]) || 0), 0);
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").replace(/_/g, " ");
        return { key, label, value: sum };
      });
  }, [filtered, field]);

  return (
    <MetricGrid>
      <KpiCard title="Records" value={filtered.length} format="number" />
      {numericSummary.map((s) => (
        <KpiCard key={s.key} title={`Total ${s.label}`} value={s.value} format="compact" />
      ))}
      <DataTable
        data={filtered as never[]}
        columns={columns as never[]}
        title={`${String(value)} — ${filtered.length} records`}
        pageSize={15}
        dense
        searchable
      />
    </MetricGrid>
  );
}
