import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { COMPONENTS } from "../knowledge/components.js";
import { TYPES } from "../knowledge/types.js";
import { METRIC_CONFIG_DOCS, FORMAT_ENGINE_DOCS, THEMING_DOCS } from "../knowledge/config.js";
import { PATTERNS } from "../knowledge/patterns.js";
import { FORMAT_EXAMPLES } from "../knowledge/format-examples.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function componentCatalogMarkdown(): string {
  const lines = [
    "# MetricUI Component Catalog\n",
    "| Component | Category | Description |",
    "|-----------|----------|-------------|",
  ];
  for (const c of COMPONENTS) {
    lines.push(`| \`${c.name}\` | ${c.category} | ${c.description} |`);
  }
  lines.push(
    "\n## Import\n",
    "```tsx",
    `import { ${COMPONENTS.map((c) => c.name).join(", ")} } from "metricui";`,
    "```",
  );
  return lines.join("\n");
}

function componentDetailMarkdown(name: string): string | null {
  const c = COMPONENTS.find(
    (comp) => comp.name.toLowerCase() === name.toLowerCase()
  );
  if (!c) return null;

  const lines = [
    `# ${c.name}\n`,
    `**Category:** ${c.category}\n`,
    c.longDescription,
    "\n## Import\n",
    "```tsx",
    `import { ${c.importName} } from "metricui";`,
    "```",
    "\n## Props\n",
    "| Prop | Type | Required | Default | Description |",
    "|------|------|----------|---------|-------------|",
  ];

  for (const p of c.props) {
    const dep = p.deprecated ? ` *(deprecated: ${p.deprecated})*` : "";
    const def = p.default ?? "—";
    lines.push(
      `| \`${p.name}\` | \`${p.type}\` | ${p.required ? "Yes" : "No"} | \`${def}\` | ${p.description}${dep} |`
    );
  }

  if (c.dataShape) {
    lines.push("\n## Data Shape\n", "```typescript", c.dataShape, "```");
  }

  lines.push("\n## Minimal Example\n", "```tsx", c.minimalExample, "```");

  for (const ex of c.examples) {
    lines.push(`\n### ${ex.title}\n`, ex.description, "\n```tsx", ex.code, "```");
  }

  if (c.configFields.length > 0) {
    lines.push(
      "\n## MetricConfig Fields\n",
      `This component reads these fields from \`<MetricProvider>\`: ${c.configFields.map((f) => `\`${f}\``).join(", ")}`
    );
  }

  if (c.notes.length > 0) {
    lines.push("\n## Notes\n");
    for (const n of c.notes) {
      lines.push(`- ${n}`);
    }
  }

  if (c.relatedComponents.length > 0) {
    lines.push(
      "\n## Related Components\n",
      c.relatedComponents.map((r) => `- \`${r}\``).join("\n")
    );
  }

  return lines.join("\n");
}

function allTypesMarkdown(): string {
  const lines = ["# MetricUI TypeScript Types\n"];
  for (const t of TYPES) {
    lines.push(
      `## ${t.name}\n`,
      `*${t.kind}* — ${t.description}\n`,
      "```typescript",
      t.definition,
      "```\n"
    );
  }
  return lines.join("\n");
}

function typeDetailMarkdown(name: string): string | null {
  const t = TYPES.find((tp) => tp.name.toLowerCase() === name.toLowerCase());
  if (!t) return null;
  const lines = [
    `# ${t.name}\n`,
    `*${t.kind}* — ${t.description}\n`,
    "```typescript",
    t.definition,
    "```",
  ];
  if (t.relatedTypes.length > 0) {
    lines.push(
      "\n## Related Types\n",
      t.relatedTypes.map((r) => `- \`${r}\``).join("\n")
    );
  }
  return lines.join("\n");
}

function allPatternsMarkdown(): string {
  const lines = ["# MetricUI Usage Patterns\n"];
  for (const p of PATTERNS) {
    lines.push(
      `## ${p.name}\n`,
      p.description,
      `\n**Tags:** ${p.tags.join(", ")}\n`,
      "```tsx",
      p.code,
      "```\n"
    );
  }
  return lines.join("\n");
}

function patternDetailMarkdown(slug: string): string | null {
  const p = PATTERNS.find((pat) => pat.slug === slug);
  if (!p) return null;
  return [
    `# ${p.name}\n`,
    p.description,
    `\n**Tags:** ${p.tags.join(", ")}\n`,
    "```tsx",
    p.code,
    "```",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export function registerResources(server: McpServer): void {
  // Static resources
  server.resource("catalog", "metricui://catalog", {
    description: "Complete list of all MetricUI components with descriptions",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://catalog", mimeType: "text/markdown", text: componentCatalogMarkdown() }],
  }));

  server.resource("config", "metricui://config", {
    description: "MetricProvider global config reference — all fields, defaults, resolution order",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://config", mimeType: "text/markdown", text: METRIC_CONFIG_DOCS }],
  }));

  server.resource("format", "metricui://format", {
    description: "Format engine reference — currency, percent, duration, compact, locale",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://format", mimeType: "text/markdown", text: FORMAT_ENGINE_DOCS }],
  }));

  server.resource("theming", "metricui://theming", {
    description: "Theming reference — CSS variables, variants, color palette, dark mode",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://theming", mimeType: "text/markdown", text: THEMING_DOCS }],
  }));

  server.resource("types", "metricui://types", {
    description: "All TypeScript type definitions exported by MetricUI",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://types", mimeType: "text/markdown", text: allTypesMarkdown() }],
  }));

  server.resource("patterns", "metricui://patterns", {
    description: "Common usage patterns and code recipes for MetricUI",
    mimeType: "text/markdown",
  }, async () => ({
    contents: [{ uri: "metricui://patterns", mimeType: "text/markdown", text: allPatternsMarkdown() }],
  }));

  // Resource templates
  server.resource("component-detail", new ResourceTemplate("metricui://components/{name}", { list: undefined }), {
    description: "Full API reference for a specific MetricUI component",
    mimeType: "text/markdown",
  }, async (uri, variables) => {
    const name = variables.name as string;
    const md = componentDetailMarkdown(name);
    if (!md) {
      throw new Error(
        `Unknown component: "${name}". Available: ${COMPONENTS.map((c) => c.name).join(", ")}`
      );
    }
    return {
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: md }],
    };
  });

  server.resource("type-detail", new ResourceTemplate("metricui://types/{name}", { list: undefined }), {
    description: "TypeScript type definition for a specific MetricUI type",
    mimeType: "text/markdown",
  }, async (uri, variables) => {
    const name = variables.name as string;
    const md = typeDetailMarkdown(name);
    if (!md) {
      throw new Error(
        `Unknown type: "${name}". Available: ${TYPES.map((t) => t.name).join(", ")}`
      );
    }
    return {
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: md }],
    };
  });

  server.resource("pattern-detail", new ResourceTemplate("metricui://patterns/{slug}", { list: undefined }), {
    description: "Specific usage pattern/recipe for MetricUI",
    mimeType: "text/markdown",
  }, async (uri, variables) => {
    const slug = variables.slug as string;
    const md = patternDetailMarkdown(slug);
    if (!md) {
      throw new Error(
        `Unknown pattern: "${slug}". Available: ${PATTERNS.map((p) => p.slug).join(", ")}`
      );
    }
    return {
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: md }],
    };
  });
}
