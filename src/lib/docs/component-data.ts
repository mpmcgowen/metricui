/**
 * Data adapter — imports from MCP knowledge base and enriches for docs site.
 * Single source of truth: mcp-server/src/knowledge/components.ts
 */

import { COMPONENTS } from "@knowledge/components";
import type { ComponentDef, PropDef, ComponentExample } from "@knowledge/components";

export type { ComponentDef, PropDef, ComponentExample };

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

function toSlug(name: string): string {
  // KpiCard -> kpi-card, AreaChart -> area-chart, DataTable -> data-table
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Enriched component type
// ---------------------------------------------------------------------------

export interface DocComponent extends ComponentDef {
  slug: string;
  categoryLabel: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  card: "Cards",
  chart: "Charts",
  table: "Data",
  ui: "UI",
};

// ---------------------------------------------------------------------------
// Build enriched components
// ---------------------------------------------------------------------------

const DOC_COMPONENTS: DocComponent[] = COMPONENTS.map((c) => ({
  ...c,
  slug: c.slug ?? toSlug(c.importName),
  categoryLabel: CATEGORY_LABELS[c.category] ?? c.category,
}));

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getAllComponents(): DocComponent[] {
  return DOC_COMPONENTS;
}

export function getComponent(slug: string): DocComponent | undefined {
  return DOC_COMPONENTS.find((c) => c.slug === slug);
}

export function getComponentsByCategory(
  category: ComponentDef["category"]
): DocComponent[] {
  return DOC_COMPONENTS.filter((c) => c.category === category);
}

export function getComponentByName(name: string): DocComponent | undefined {
  return DOC_COMPONENTS.find(
    (c) => c.name === name || c.importName === name
  );
}
