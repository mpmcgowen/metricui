"use client";

import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "setup", title: "Setup", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 2 },
  { id: "tools", title: "Tools", level: 2 },
  { id: "tool-generate-dashboard", title: "generate_dashboard", level: 3 },
  { id: "tool-get-component-api", title: "get_component_api", level: 3 },
  { id: "tool-get-component-example", title: "get_component_example", level: 3 },
  { id: "tool-search-docs", title: "search_docs", level: 3 },
  { id: "tool-search-components", title: "search_components", level: 3 },
  { id: "tool-validate-props", title: "validate_props", level: 3 },
  { id: "tool-suggest-format", title: "suggest_format", level: 3 },
  { id: "tool-generate-table-columns", title: "generate_table_columns", level: 3 },
  { id: "tool-generate-provider-config", title: "generate_provider_config", level: 3 },
  { id: "tool-generate-data-shape", title: "generate_data_shape", level: 3 },
  { id: "tool-get-setup-guide", title: "get_setup_guide", level: 3 },
  { id: "tool-init-project", title: "init_project", level: 3 },
  { id: "tool-list-components", title: "list_components", level: 3 },
  { id: "resources", title: "Resources", level: 2 },
  { id: "prompts", title: "Prompts", level: 2 },
  { id: "llms-txt", title: "llms.txt", level: 2 },
];

function ToolCard({ id, name, description, params, children }: {
  id: string;
  name: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 mt-8 first:mt-0">
      <h3 className="mb-1 text-base font-semibold text-[var(--foreground)]">
        <code className="rounded bg-[var(--card-bg)] px-2 py-0.5 text-sm font-mono border border-[var(--card-border)]">
          {name}
        </code>
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{description}</p>
      {params && params.length > 0 && (
        <DataTable
          data={params.map((p) => ({ parameter: p.name, type: p.type, required: p.required ? "Yes" : "No", description: p.description }))}
          columns={[
            { key: "parameter", header: "Parameter", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
            { key: "required", header: "Required" },
            { key: "description", header: "Description" },
          ]}
          dense
          variant="ghost"
        />
      )}
      {children}
    </div>
  );
}

export default function McpServerGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MCP Server
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          The MetricUI MCP server gives AI coding tools structured knowledge of every component,
          every prop, and every pattern — so they generate production-quality dashboards on the first try.
        </p>

        <DocSection id="setup" title="Setup">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            One command adds MetricUI to your AI tool. The server runs via npx — no global install needed.
          </p>

          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Claude Code</h3>
          <CodeBlock
            code={`claude mcp add --transport stdio metricui -- npx -y @metricui/mcp-server`}
            language="bash"
          />

          <h3 className="mt-6 mb-2 text-base font-semibold text-[var(--foreground)]">Cursor / Windsurf</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Add to your project&apos;s <code className="text-sm">.cursor/mcp.json</code> or equivalent:
          </p>
          <CodeBlock
            code={`{
  "mcpServers": {
    "metricui": {
      "command": "npx",
      "args": ["-y", "@metricui/mcp-server"]
    }
  }
}`}
            language="json"
          />

          <h3 className="mt-6 mb-2 text-base font-semibold text-[var(--foreground)]">Global install (optional)</h3>
          <CodeBlock
            code={`npm install -g @metricui/mcp-server`}
            language="bash"
          />
        </DocSection>

        <DocSection id="how-it-works" title="How It Works">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The MCP server exposes MetricUI&apos;s full API surface through the{" "}
            <a href="https://modelcontextprotocol.io" className="font-medium text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">
              Model Context Protocol
            </a>
            . When your AI tool connects, it receives:
          </p>
          <ul className="space-y-2 text-[14px] text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--foreground)]">Server instructions</span>
              <span>— what MetricUI is, what makes it different, and how to build dashboards the right way</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--foreground)]">13 tools</span>
              <span>— generate dashboards, look up APIs, validate props, search docs, scaffold configs</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--foreground)]">9 resources</span>
              <span>— full component catalog, config reference, format engine, theming, TypeScript types, usage patterns</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--foreground)]">4 prompts</span>
              <span>— guided workflows for building, reviewing, and migrating dashboards</span>
            </li>
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The AI doesn&apos;t guess at APIs or generate generic chart code. It knows every prop, every data shape,
            every advanced feature — and uses them. DashboardHeader, MetricGrid, conditions, goals, reference lines,
            threshold bands, filters, theme presets.
          </p>
        </DocSection>

        <DocSection id="tools" title="Tools">
          <p className="mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
            Tools are callable functions the AI invokes to look up APIs, generate code, and validate its work.
          </p>

          <ToolCard
            id="tool-generate-dashboard"
            name="generate_dashboard"
            description="Generates a complete, production-quality dashboard page with realistic sample data. Uses MetricProvider with theme presets, FilterProvider + PeriodSelector, DashboardHeader with live status, MetricGrid auto-layout, advanced KpiCards (conditions, goals, sparkline overlays), charts with reference lines and threshold bands, data-driven Callout alerts, and rich DataTable."
            params={[
              { name: "description", type: "string", required: true, description: "What the dashboard should show. E.g., 'SaaS metrics with MRR, churn, users, and revenue breakdown'" },
              { name: "theme", type: "enum", required: false, description: "Theme preset: indigo, emerald, rose, amber, cyan, violet, slate, orange" },
              { name: "style", type: "enum", required: false, description: "'dense' or 'spacious'" },
              { name: "variant", type: "enum", required: false, description: "'default', 'outlined', 'ghost', or 'elevated'" },
              { name: "metrics", type: "string[]", required: false, description: "Specific metrics to include" },
            ]}
          >
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
              Returns a full <code className="text-sm">page.tsx</code> file — imports, sample data, and component tree — ready to paste into your project.
              Detects keywords in the description to include specialized components: &quot;funnel&quot; adds Funnel, &quot;gauge&quot; adds Gauge, &quot;waterfall&quot; adds Waterfall.
            </p>
          </ToolCard>

          <ToolCard
            id="tool-get-component-api"
            name="get_component_api"
            description="Returns the full API reference for any component — every prop with type, default, and description. Includes data shape, minimal example, advanced examples, MetricConfig fields, and usage notes."
            params={[
              { name: "component", type: "string", required: true, description: "Component name. E.g., 'KpiCard', 'AreaChart', 'DataTable'" },
            ]}
          />

          <ToolCard
            id="tool-get-component-example"
            name="get_component_example"
            description="Returns a complete, working code example for a component with requested features enabled. Uses realistic sample data and annotates every prop. The AI adapts the values — the structure is correct as-is."
            params={[
              { name: "component", type: "string", required: true, description: "Component name" },
              { name: "features", type: "string[]", required: false, description: "Features to showcase: 'comparison', 'sparkline', 'goal', 'conditions', 'referenceLines', 'thresholds', 'stacked', 'grouped', 'horizontal', 'footer', 'pagination'" },
            ]}
          />

          <ToolCard
            id="tool-search-docs"
            name="search_docs"
            description="Search all MetricUI documentation — components, props, types, patterns, format examples, and guides. Returns ranked results with snippets. Best for conceptual questions like 'how do I set up dark mode?' or 'what format for currency?'"
            params={[
              { name: "query", type: "string", required: true, description: "Natural language query. E.g., 'dark mode setup', 'table pagination', 'reference lines'" },
              { name: "limit", type: "number", required: false, description: "Max results (default: 5)" },
              { name: "type", type: "enum", required: false, description: "Filter by: 'component', 'prop', 'type', 'pattern', 'guide', 'format', or 'all'" },
            ]}
          />

          <ToolCard
            id="tool-search-components"
            name="search_components"
            description="Find the right component for a use case. Searches by name, description, and props. Returns ranked results."
            params={[
              { name: "query", type: "string", required: true, description: "Natural language. E.g., 'show revenue over time', 'pie chart', 'status health check'" },
            ]}
          />

          <ToolCard
            id="tool-validate-props"
            name="validate_props"
            description="Validates a component's prop configuration. Catches unknown props, missing required props, deprecated usage, and common mistakes like using sparklineData instead of sparkline."
            params={[
              { name: "component", type: "string", required: true, description: "Component name" },
              { name: "props", type: "object", required: true, description: "Props to validate as key-value pairs" },
            ]}
          />

          <ToolCard
            id="tool-suggest-format"
            name="suggest_format"
            description="Suggests the right format configuration for a value type. Handles revenue, percentages, durations, counts, and more."
            params={[
              { name: "valueType", type: "string", required: true, description: "What kind of value: 'revenue', 'percentage', 'time', 'count'" },
              { name: "sampleValue", type: "number", required: false, description: "A sample value to show formatted output" },
            ]}
          />

          <ToolCard
            id="tool-generate-table-columns"
            name="generate_table_columns"
            description="Generates DataTable column definitions from a list of fields. Automatically applies format, alignment, and sortable based on field type."
            params={[
              { name: "fields", type: "object[]", required: true, description: "Array of { key, label?, type: 'string'|'number'|'currency'|'percent'|'date'|'boolean', sortable? }" },
            ]}
          />

          <ToolCard
            id="tool-generate-provider-config"
            name="generate_provider_config"
            description="Generates MetricProvider configuration JSX with only the fields you need."
            params={[
              { name: "locale", type: "string", required: false, description: "BCP 47 locale" },
              { name: "currency", type: "string", required: false, description: "ISO 4217 currency code" },
              { name: "animate", type: "boolean", required: false, description: "Animation toggle" },
              { name: "variant", type: "string", required: false, description: "Card variant" },
              { name: "dense", type: "boolean", required: false, description: "Dense mode" },
              { name: "nullDisplay", type: "string", required: false, description: "Null display strategy" },
            ]}
          />

          <ToolCard
            id="tool-generate-data-shape"
            name="generate_data_shape"
            description="Generates the TypeScript interface for a component's required data shape."
            params={[
              { name: "component", type: "string", required: true, description: "Component name" },
              { name: "series", type: "string[]", required: false, description: "Series/field names to include" },
            ]}
          />

          <ToolCard
            id="tool-get-setup-guide"
            name="get_setup_guide"
            description="Returns complete setup instructions — install commands, peer dependencies, provider setup, CSS imports, and framework-specific config."
            params={[
              { name: "framework", type: "enum", required: false, description: "'nextjs', 'vite', 'cra', 'remix', or 'generic' (default: nextjs)" },
            ]}
          />

          <ToolCard
            id="tool-init-project"
            name="init_project"
            description="Generates CLAUDE.md content for your project so AI tools always use MetricUI components. Run once per project."
            params={[]}
          />

          <ToolCard
            id="tool-list-components"
            name="list_components"
            description="Lists all MetricUI components with name, category, description, and prop count."
            params={[
              { name: "category", type: "enum", required: false, description: "Filter by: 'chart', 'card', 'table', or 'ui'" },
            ]}
          />
        </DocSection>

        <DocSection id="resources" title="Resources">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Resources are read-only data the AI can pull into its context. These provide deep reference material
            that&apos;s too large for tool responses.
          </p>

          <h3 className="mb-3 text-base font-semibold text-[var(--foreground)]">Static Resources</h3>
          <DataTable
            data={[
              { uri: "metricui://catalog", description: "Complete list of all components with descriptions and import statement" },
              { uri: "metricui://config", description: "MetricProvider & MetricConfig — all fields, defaults, nesting, hooks, resolution order" },
              { uri: "metricui://format", description: "Format engine — shorthand strings, FormatConfig objects, fmt() helper, compact modes, duration styles" },
              { uri: "metricui://theming", description: "CSS variables, card variants, semantic colors, texture control, dense mode, dark mode, motion config" },
              { uri: "metricui://types", description: "All TypeScript types exported by MetricUI — FormatOption, ComparisonConfig, Condition, Column, etc." },
              { uri: "metricui://patterns", description: "Usage patterns and code recipes — full dashboards, KPI features, data fetching, conditional formatting, theme presets, reference lines, filter system, responsive layout" },
            ]}
            columns={[
              { key: "uri", header: "URI", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />

          <h3 className="mt-8 mb-3 text-base font-semibold text-[var(--foreground)]">Resource Templates</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Dynamic resources that accept a parameter to return specific items:
          </p>
          <DataTable
            data={[
              { uri: "metricui://components/{name}", description: "Full API reference for a specific component — props table, data shape, examples, notes" },
              { uri: "metricui://types/{name}", description: "TypeScript definition for a specific type — full interface, related types" },
              { uri: "metricui://patterns/{slug}", description: "Specific usage pattern — description, tags, complete code example" },
            ]}
            columns={[
              { key: "uri", header: "URI Template", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        <DocSection id="prompts" title="Prompts">
          <p className="mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
            Prompts are guided workflows the AI can invoke. They inject structured context and instructions
            for specific tasks.
          </p>

          <div className="space-y-6">
            <div className="rounded-lg border border-[var(--card-border)] p-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">build_dashboard</h3>
              <p className="mt-1 text-[14px] text-[var(--muted)]">
                Guided dashboard creation from a description. Injects the full component selection guide (26 components organized by use case),
                architecture rules (MetricProvider, FilterProvider, DashboardHeader, MetricGrid), advanced feature tips (conditions, goals,
                reference lines, threshold bands, Callout rules), and format mapping.
              </p>
              <div className="mt-2 text-[13px] font-mono text-[var(--accent)]">
                Parameter: <code>description</code> — what the dashboard should show
              </div>
            </div>

            <div className="rounded-lg border border-[var(--card-border)] p-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">review_dashboard</h3>
              <p className="mt-1 text-[14px] text-[var(--muted)]">
                Reviews existing MetricUI code for errors (missing required props, wrong data shapes), deprecations
                (sparklineData → sparkline, compact → dense, grouped → groupMode), best practices (missing MetricProvider,
                unformatted values, missing data states), and accessibility issues.
              </p>
              <div className="mt-2 text-[13px] font-mono text-[var(--accent)]">
                Parameter: <code>code</code> — the MetricUI code to review
              </div>
            </div>

            <div className="rounded-lg border border-[var(--card-border)] p-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">convert_dashboard</h3>
              <p className="mt-1 text-[14px] text-[var(--muted)]">
                Converts a screenshot, mockup, wireframe, or hand-drawn sketch into MetricUI code.
                Paste an image in chat, then invoke this prompt. The AI identifies visual elements (KPI cards,
                charts, tables, filters), maps them to MetricUI components, infers theme/format/layout,
                and generates a complete working dashboard.
              </p>
              <div className="mt-2 text-[13px] font-mono text-[var(--accent)]">
                Parameter: <code>description</code> (optional) — additional context about the image
              </div>
            </div>

            <div className="rounded-lg border border-[var(--card-border)] p-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">migrate_to_metricui</h3>
              <p className="mt-1 text-[14px] text-[var(--muted)]">
                Migrates dashboard code from another library (Tremor, Recharts, shadcn, Chart.js) to MetricUI.
                Includes component mapping tables, data shape differences, and key migration steps.
              </p>
              <div className="mt-2 text-[13px] font-mono text-[var(--accent)]">
                Parameters: <code>source_library</code>, <code>code</code>
              </div>
            </div>
          </div>
        </DocSection>

        <DocSection id="llms-txt" title="llms.txt">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For AI tools that don&apos;t support MCP, MetricUI serves a machine-readable documentation file at{" "}
            <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">/llms.txt</a>.
            This is a plain text file containing every component, every prop, every type, and every pattern — formatted
            for LLM consumption.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            AI tools can fetch this file to gain full knowledge of MetricUI&apos;s API without needing a persistent
            MCP connection. The MCP server is more powerful (interactive tools, validation, generation), but llms.txt
            provides a solid baseline for any AI that can read URLs.
          </p>
        </DocSection>
      </div>

      <OnThisPage items={tocItems} />
    </div>
  );
}
