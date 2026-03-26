import Link from "next/link";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { getAllComponents } from "@/lib/docs/component-data";
import {
  CreditCard,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Activity,
  LayoutGrid,
  Combine,
  Grid3X3,
  ArrowRight,
  Rocket,
  Hash,
  Palette,
  AlertCircle,
  Accessibility,
  Calendar,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  KpiCard: CreditCard,
  StatGroup: LayoutGrid,
  AreaChart: Activity,
  BarChart: BarChart3,
  LineChart: LineChart,
  DonutChart: PieChart,
  DataTable: Table2,
  Gauge: Activity,
  HeatMap: Grid3X3,
  BarLineChart: Combine,
};

const guides = [
  {
    title: "Getting Started",
    description: "Install MetricUI and build your first dashboard in minutes.",
    href: "/docs/guides/getting-started",
    icon: Rocket,
  },
  {
    title: "Data Format",
    description: "One flat data shape works across every chart. Swap chart types without reshaping data.",
    href: "/docs/guides/data-format",
    icon: Table2,
  },
  {
    title: "Format Engine",
    description: "Currency, percent, duration, compact — format any value with one prop.",
    href: "/docs/guides/format-engine",
    icon: Hash,
  },
  {
    title: "Theming",
    description: "CSS variables, presets, dark mode, custom variants.",
    href: "/docs/guides/theming",
    icon: Palette,
  },
  {
    title: "Filtering",
    description: "Period selectors, comparison modes, dimension filters — pure UI, your data.",
    href: "/docs/guides/filtering",
    icon: Calendar,
  },
  {
    title: "Data States",
    description: "Loading, empty, error, and stale — every component handles them.",
    href: "/docs/guides/data-states",
    icon: AlertCircle,
  },
  {
    title: "Accessibility",
    description: "Keyboard navigation, ARIA, reduced motion, color blind safe.",
    href: "/docs/guides/accessibility",
    icon: Accessibility,
  },
  {
    title: "MCP Server",
    description: "Give AI tools full knowledge of every component, prop, and pattern. 13 tools, 9 resources, 3 prompts.",
    href: "/docs/guides/mcp-server",
    icon: Rocket,
  },
  {
    title: "AI Insights",
    description: "BYO LLM dashboard intelligence. Ask questions about live data with @ mentions, streaming, and three-level context.",
    href: "/docs/ai-insights",
    icon: Rocket,
  },
];

export default function DocsOverview() {
  const components = getAllComponents();

  return (
    <div className="px-8 py-8 lg:max-w-4xl">
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          MetricUI Documentation
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          A React component library for building data dashboards — KPI cards, charts,
          tables, and more with built-in formatting, theming, and data states.
        </p>
      </div>

      {/* Quick install */}
      <div className="mt-8">
        <CodeBlock
          code={`npm install metricui`}
          language="bash"
          className="max-w-md"
        />
      </div>

      {/* Principles */}
      <div className="mt-14">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
          How MetricUI Thinks
        </h2>
        <p className="mb-6 max-w-2xl text-[14px] leading-relaxed text-[var(--muted)]">
          Seven principles that shape every component. Understanding these will tell you
          whether MetricUI is the right tool for your project.
        </p>

        <div className="space-y-6">
          {[
            {
              title: "AI-native from day one",
              body: "MetricUI ships an MCP server, llms.txt, and structured documentation designed for AI coding tools. When Claude, Cursor, or Copilot builds a dashboard, it reaches for MetricUI and gets the props right on the first try. The API is deliberately simple and consistent \u2014 because the same things that make code easy for AI to generate make it easy for you to read.",
            },
            {
              title: "Your data, our rendering",
              body: "MetricUI never fetches, caches, or transforms your data. Pass values in, get a dashboard out. REST, GraphQL, Supabase, a CSV you parsed at 2am \u2014 we don\u2019t care where it comes from. Filters are pure UI: they tell you what the user selected, you decide what to fetch.",
            },
            {
              title: "One data shape, any chart",
              body: "Pass flat rows with an index and categories. The same data renders as an AreaChart, BarChart, DonutChart, or HeatMap \u2014 swap the component, keep your data. No more reshaping arrays for every chart library\u2019s proprietary format.",
            },
            {
              title: "Format once, use everywhere",
              body: "Say format=\"currency\" and every component \u2014 cards, charts, tables, tooltips \u2014 knows how to display it. Currency, percent, duration, compact notation, locale-aware. One prop replaces pages of Intl.NumberFormat boilerplate.",
            },
            {
              title: "Every component handles failure",
              body: "Loading skeletons that match the layout. Empty states with messages. Error states with retry buttons. Stale data indicators. One prop each. No wrapper components, no conditional rendering trees, no forgotten edge cases.",
            },
            {
              title: "Set it once, override when needed",
              body: "MetricProvider sets global defaults \u2014 theme, locale, currency, density, animation. Every component inherits. Any prop overrides. Nest providers for sections. You configure once at the top; components just work.",
            },
            {
              title: "Developer-first, not config-first",
              body: "Components work with zero config and get smarter as you add props. Auto-infer columns from data. Auto-detect chart series. Auto-format numbers by magnitude. Smart defaults mean your first render looks good; explicit props mean your final render looks exactly right.",
            },
          ].map((principle) => (
            <div key={principle.title} className="flex gap-4">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <div>
                <p className="text-[14px] font-semibold text-[var(--foreground)]">
                  {principle.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
                  {principle.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Built for real use */}
      <div className="mt-12">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
          Built for Real Use
        </h2>
        <p className="mb-6 max-w-2xl text-[14px] leading-relaxed text-[var(--muted)]">
          Details that add up when you&apos;re shipping a product, not a prototype.
        </p>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            "forwardRef on every component",
            "id, data-testid, classNames on every component",
            "Error boundaries that don\u2019t crash your dashboard",
            "prefers-reduced-motion respected globally",
            "Keyboard-accessible drill-downs, sorts, and toggles",
            "Colorblind-safe default palette",
            "Dense mode on everything \u2014 one prop or global",
            "Dark mode via CSS variables \u2014 zero JS",
            "8 theme presets, custom presets via ThemePreset type",
            "TypeScript-first \u2014 every prop, every callback, every type exported",
            "MCP server for AI coding tools \u2014 Claude, Cursor, Copilot",
            "200+ tests, <1s runtime",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-[13px] text-[var(--muted)]"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Guides */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Guides</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)]/30"
              >
                <Icon className="h-5 w-5 text-[var(--accent)]" />
                <span className="mt-2 text-[14px] font-semibold text-[var(--foreground)]">
                  {guide.title}
                </span>
                <span className="mt-1 flex-1 text-[12px] leading-relaxed text-[var(--muted)]">
                  {guide.description}
                </span>
                <span className="mt-3 flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  Read guide <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Components */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((comp) => {
            const Icon = iconMap[comp.importName] || Activity;
            return (
              <Link
                key={comp.slug}
                href={`/docs/${comp.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)]/30"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                    {comp.categoryLabel}
                  </span>
                </div>
                <span className="mt-2 text-[14px] font-semibold text-[var(--foreground)]">
                  {comp.name}
                </span>
                <span className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[var(--muted)]">
                  {comp.description}
                </span>
                <span className="mt-3 flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  View docs <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
