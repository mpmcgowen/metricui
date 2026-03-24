"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MetricProvider } from "@/lib/MetricProvider";
import type { CardVariant } from "@/lib/types";
import {
  BarChart3,
  CreditCard,
  LineChart,
  PieChart,
  Table2,
  Activity,
  LayoutGrid,
  ArrowLeft,
  Menu,
  X,
  Combine,
  Grid3X3,
  ArrowDownNarrowWide,
  Crosshair,
  ChevronDown,
  Github,
  Globe,
  CircleDot,
  MessageSquare,
  Heading,
  PanelTop,
  SeparatorHorizontal,
  BookOpen,
  Layers,
  Rocket,
  PanelRightOpen,
  Hash,
  Palette,
  AlertCircle,
  Accessibility,
  Calendar,
  ToggleLeft,
  ListFilter,
  Tag,
  TrendingUp,
  Tags,
  Bot,
  Map,
  Milestone,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
  pro?: boolean;
}

const nav: { label: string; items: NavItem[] }[] = [
  {
    label: "Guides",
    items: [
      { title: "Overview", href: "/docs", icon: BookOpen },
      { title: "Getting Started", href: "/docs/guides/getting-started", icon: Rocket },
      { title: "Data Format", href: "/docs/guides/data-format", icon: Table2 },
      { title: "Format Engine", href: "/docs/guides/format-engine", icon: Hash },
      { title: "Theming", href: "/docs/guides/theming", icon: Palette },
      { title: "Filtering", href: "/docs/guides/filtering", icon: Calendar },
      { title: "Interactions", href: "/docs/guides/interactions", icon: Crosshair },
      { title: "Data States", href: "/docs/guides/data-states", icon: AlertCircle },
      { title: "Accessibility", href: "/docs/guides/accessibility", icon: Accessibility },
      { title: "MCP Server", href: "/docs/guides/mcp-server", icon: Bot },
      { title: "Cookbook", href: "/docs/guides/cookbook", icon: Layers },
    ],
  },
  {
    label: "Cards",
    items: [
      { title: "KPI Card", href: "/docs/kpi-card", icon: CreditCard },
      { title: "Stat Group", href: "/docs/stat-group", icon: LayoutGrid },
    ],
  },
  {
    label: "Charts",
    items: [
      { title: "Area Chart", href: "/docs/area-chart", icon: Activity },
      { title: "Bar Chart", href: "/docs/bar-chart", icon: BarChart3 },
      { title: "Line Chart", href: "/docs/line-chart", icon: LineChart },
      { title: "Donut Chart", href: "/docs/donut-chart", icon: PieChart },
      { title: "Gauge", href: "/docs/gauge", icon: Activity },
      { title: "Bullet Chart", href: "/docs/bullet-chart", icon: Crosshair, pro: true },
      { title: "HeatMap", href: "/docs/heatmap", icon: Grid3X3 },
      { title: "Funnel", href: "/docs/funnel", icon: ArrowDownNarrowWide, pro: true },
      { title: "Bar + Line Chart", href: "/docs/bar-line-chart", icon: Combine },
      { title: "Waterfall", href: "/docs/waterfall", icon: BarChart3, pro: true },
      { title: "Sparkline", href: "/docs/sparkline", icon: Activity },
    ],
  },
  {
    label: "Layout",
    items: [
      { title: "Dashboard Header", href: "/docs/dashboard-header", icon: PanelTop },
      { title: "Section Header", href: "/docs/section-header", icon: Heading },
      { title: "Divider", href: "/docs/divider", icon: SeparatorHorizontal },
      { title: "MetricGrid", href: "/docs/metric-grid", icon: LayoutGrid },
    ],
  },
  {
    label: "UI",
    items: [
      { title: "StatusIndicator", href: "/docs/status-indicator", icon: CircleDot },
      { title: "Callout", href: "/docs/callout", icon: MessageSquare },
      { title: "Badge", href: "/docs/badge", icon: Tag },
      { title: "Drill Down", href: "/docs/drill-down", icon: PanelRightOpen },
    ],
  },
  {
    label: "Filters",
    items: [
      { title: "Period Selector", href: "/docs/period-selector", icon: Calendar },
      { title: "Segment Toggle", href: "/docs/segment-toggle", icon: ToggleLeft },
      { title: "Dropdown Filter", href: "/docs/dropdown-filter", icon: ListFilter },
      { title: "Filter Tags", href: "/docs/filter-tags", icon: Tags },
      { title: "Filter Bar", href: "/docs/filter-bar", icon: ListFilter },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Data Table", href: "/docs/data-table", icon: Table2 },
    ],
  },
  {
    label: "Demos",
    items: [
      { title: "SaaS Analytics", href: "/demos/saas", icon: TrendingUp },
      { title: "GitHub Analytics", href: "/demos/github", icon: Github },
      { title: "Wikipedia Live", href: "/demos/wikipedia", icon: Globe },
      { title: "World Explorer", href: "/demos/world", icon: Map },
    ],
  },
  {
    label: "More",
    items: [
      { title: "Roadmap", href: "/roadmap", icon: Milestone },
    ],
  },
];

// ---------------------------------------------------------------------------
// Collapsible nav group
// ---------------------------------------------------------------------------

function NavGroup({
  label,
  count,
  defaultOpen,
  alwaysOpen,
  children,
}: {
  label: string;
  count: number;
  defaultOpen: boolean;
  alwaysOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => !alwaysOpen && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors",
          alwaysOpen
            ? "text-[var(--muted)] cursor-default"
            : "text-[var(--muted)] hover:text-[var(--foreground)]",
        )}
      >
        <span>{label}</span>
        <span className="flex items-center gap-1">
          {!alwaysOpen && (
            <span className="font-[family-name:var(--font-mono)] text-[9px] font-normal opacity-40">
              {count}
            </span>
          )}
          {!alwaysOpen && (
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                !open && "-rotate-90",
              )}
            />
          )}
        </span>
      </button>
      {open && (
        <div className="mt-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [variant, setVariant] = useState<string>("default");
  const [dense, setDense] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [configOpen, setConfigOpen] = useState(true);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--foreground)] text-[10px] font-bold text-[var(--background)]">
            M
          </div>
          <span className="text-sm font-bold">MetricUI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-[var(--muted)] hover:text-[var(--foreground)] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 border-b border-[var(--card-border)] px-4 py-2.5 text-[11px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to home
      </Link>

      {/* Global Config */}
      <div className="border-b border-[var(--card-border)] px-3 py-3">
        <button
          onClick={() => setConfigOpen(!configOpen)}
          className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]"
        >
          Global Config
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              !configOpen && "-rotate-90"
            )}
          />
        </button>
        {configOpen && (
          <div className="mt-2.5 space-y-2">
            {/* Variant */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium text-[var(--muted)]">
                Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="h-5 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-1 text-[10px] text-[var(--foreground)] outline-none"
              >
                <option value="default">default</option>
                <option value="outlined">outlined</option>
                <option value="ghost">ghost</option>
                <option value="elevated">elevated</option>
              </select>
            </div>
            {/* Dense */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium text-[var(--muted)]">
                Dense
              </label>
              <button
                onClick={() => setDense(!dense)}
                className={cn(
                  "relative h-4 w-7 rounded-full transition-colors",
                  dense
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--card-border)]"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform",
                    dense && "translate-x-3"
                  )}
                />
              </button>
            </div>
            {/* Animate */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium text-[var(--muted)]">
                Animate
              </label>
              <button
                onClick={() => setAnimate(!animate)}
                className={cn(
                  "relative h-4 w-7 rounded-full transition-colors",
                  animate
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--card-border)]"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform",
                    animate && "translate-x-3"
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((group) => {
          const hasActiveItem = group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
          const isDemo = group.label === "Demos";
          const isGuides = group.label === "Guides";
          // Demos and Guides always open; others open if they contain the active page
          const defaultOpen = isDemo || isGuides || hasActiveItem;

          return (
            <NavGroup
              key={group.label}
              label={group.label}
              count={group.items.length}
              defaultOpen={defaultOpen}
              alwaysOpen={isDemo}
            >
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.soon ? "#" : item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]",
                      item.soon && "pointer-events-none opacity-40"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.title}
                    {item.pro && (
                      <span className="ml-auto rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                        Pro
                      </span>
                    )}
                    {item.soon && (
                      <span className="ml-auto text-[9px] uppercase tracking-wider opacity-60">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </NavGroup>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Mobile header bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center gap-3 border-b border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--foreground)] text-[9px] font-bold text-[var(--background)]">
            M
          </div>
          <span className="text-sm font-bold">MetricUI</span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="flex h-full w-64 flex-col bg-[var(--card-bg)]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card-bg)] lg:flex">
        {sidebarContent}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-hidden pt-12 lg:pt-0">
        <MetricProvider variant={variant as CardVariant} dense={dense} animate={animate}>
          {children}
        </MetricProvider>
      </main>
    </div>
  );
}
