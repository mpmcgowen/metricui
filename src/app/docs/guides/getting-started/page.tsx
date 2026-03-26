import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const tocItems: TocItem[] = [
  { id: "quick-start", title: "Quick Start", level: 2 },
  { id: "what-init-does", title: "What Init Does", level: 2 },
  { id: "manual-setup", title: "Manual Setup", level: 2 },
  { id: "css-setup", title: "CSS Setup", level: 3 },
  { id: "provider", title: "MetricProvider", level: 3 },
  { id: "first-card", title: "Your First Card", level: 2 },
  { id: "first-chart", title: "Your First Chart", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

export default function GettingStartedGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          Getting Started
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Install MetricUI and build your first dashboard in under a minute.
        </p>

        <DocSection id="quick-start" title="Quick Start">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Install the package, then run init. It detects your framework, configures your
            AI tools, and scaffolds a working dashboard:
          </p>
          <CodeBlock
            code={`npm install metricui
npx metricui init`}
            language="bash"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            That&apos;s it. Run your dev server and open <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">/dashboard</code> to
            see it live.
          </p>
        </DocSection>

        <DocSection id="what-init-does" title="What Init Does">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The init command asks two yes/no questions and sets up:
          </p>
          <ul className="space-y-2">
            {[
              { label: "AI tool config", desc: "Cursor rules, Claude Code hints, and MCP server — so your AI coding tools know to use MetricUI" },
              { label: "Starter dashboard", desc: "A real page in your app with KPIs, charts, and a table — using your framework's conventions" },
            ].map((item) => (
              <li key={item.label} className="flex gap-3 text-[14px] leading-relaxed text-[var(--muted)]">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[11px] font-bold text-[var(--accent)]">
                  ✓
                </span>
                <span><strong className="text-[var(--foreground)]">{item.label}</strong> — {item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            It&apos;s idempotent — running it again skips files that already exist. If you prefer
            to set things up manually, keep reading.
          </p>
        </DocSection>

        <DocSection id="manual-setup" title="Manual Setup">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you skipped init or want to understand what it does under the hood:
          </p>
          <CodeBlock
            code={`npm install metricui`}
            language="bash"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI requires React 18+. All chart dependencies are bundled — no extra installs needed.
          </p>
        </DocSection>

        <DocSection id="css-setup" title="CSS Setup" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Import the MetricUI stylesheet in your app entry point. This sets up the required
            CSS variables, card variants, dark mode, and animation styles.
          </p>
          <CodeBlock
            code={`import "metricui/styles.css";`}
            language="tsx"
            filename="app/layout.tsx"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI uses CSS custom properties for theming. The stylesheet provides sensible
            defaults, but you can override them — see the{" "}
            <a href="/docs/guides/theming" className="font-medium text-[var(--accent)] hover:underline">
              Theming guide
            </a>.
          </p>
        </DocSection>

        <DocSection id="provider" title="MetricProvider" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Wrap your app (or any subtree) with MetricProvider to set global defaults.
            Every MetricUI component reads from this context.
          </p>
          <CodeBlock
            code={`import { MetricProvider } from "metricui";
import "metricui/styles.css";

export default function App({ children }) {
  return (
    <MetricProvider
      locale="en-US"
      currency="USD"
      animate
      theme="indigo"
    >
      {children}
    </MetricProvider>
  );
}`}
            filename="app/layout.tsx"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricProvider supports nesting — child providers merge with their parent.
            Only the fields you specify are overridden.
          </p>
        </DocSection>

        <DocSection id="first-card" title="Your First Card">
          <CodeBlock
            code={`import { KpiCard } from "metricui";
import { DollarSign } from "lucide-react";

function RevenueCard() {
  return (
    <KpiCard
      title="Revenue"
      value={142300}
      format="currency"
      comparison={{ value: 128500 }}
      comparisonLabel="vs last month"
      icon={<DollarSign />}
    />
  );
}`}
          />
        </DocSection>

        <DocSection id="first-chart" title="Your First Chart">
          <CodeBlock
            code={`import { AreaChart } from "metricui";

const data = [
  {
    id: "revenue",
    data: [
      { x: "Jan", y: 4200 },
      { x: "Feb", y: 5100 },
      { x: "Mar", y: 4800 },
      { x: "Apr", y: 6200 },
      { x: "May", y: 7100 },
      { x: "Jun", y: 8400 },
    ],
  },
];

function RevenueChart() {
  return (
    <AreaChart
      data={data}
      title="Monthly Revenue"
      format="currency"
      height={300}
    />
  );
}`}
          />
        </DocSection>

        <DocSection id="next-steps" title="Next Steps">
          <div className="space-y-3">
            {[
              { label: "Format Engine", href: "/docs/guides/format-engine", desc: "Learn how to format currency, percent, duration, and more." },
              { label: "Theming", href: "/docs/guides/theming", desc: "Customize colors, variants, dark mode, and presets." },
              { label: "Interactions", href: "/docs/guides/interactions", desc: "Linked hover and value flash." },
              { label: "Data States", href: "/docs/guides/data-states", desc: "Handle loading, empty, error, and stale states." },
              { label: "KPI Card", href: "/docs/kpi-card", desc: "Deep dive into the most feature-rich component." },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-start gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)]/30"
              >
                <div>
                  <span className="text-[14px] font-semibold text-[var(--accent)]">
                    {link.label}
                  </span>
                  <p className="mt-0.5 text-[13px] text-[var(--muted)]">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
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
