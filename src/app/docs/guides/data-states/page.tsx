import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "loading", title: "Loading", level: 2 },
  { id: "empty", title: "Empty", level: 2 },
  { id: "error", title: "Error", level: 2 },
  { id: "stale", title: "Stale", level: 2 },
  { id: "grouped", title: "Grouped State Prop", level: 2 },
  { id: "global-defaults", title: "Global Defaults", level: 2 },
];

export default function DataStatesGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">Data States</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Every MetricUI component handles four data states out of the box: loading,
          empty, error, and stale. No conditional rendering needed.
        </p>

        <DocSection id="overview" title="Overview">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Instead of wrapping components in loading spinners or error boundaries manually,
            pass the state directly to any component. MetricUI renders the appropriate
            skeleton, message, or indicator automatically.
          </p>
        </DocSection>

        <DocSection id="loading" title="Loading">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Shows a skeleton placeholder that matches the component&apos;s layout. The skeleton
            uses CSS variables for colors — no hardcoded grays.
          </p>
          <CodeBlock
            code={`<KpiCard title="Revenue" value={0} format="currency" loading />

<AreaChart data={[]} title="Trends" loading />

<DataTable data={[]} columns={columns} loading />`}
          />
        </DocSection>

        <DocSection id="empty" title="Empty">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Displayed when there&apos;s no data to show. Customizable message, icon, and action.
          </p>
          <CodeBlock
            code={`<KpiCard
  title="Revenue"
  value={0}
  empty={{
    message: "No revenue data for this period",
    icon: <BarChart className="h-8 w-8" />,
    action: { label: "Change period", onClick: () => {} },
  }}
/>

// Or just a simple message
<AreaChart data={[]} empty={{ message: "No data available" }} />`}
          />
        </DocSection>

        <DocSection id="error" title="Error">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Shows an error message with an optional retry button. In dev mode, includes
            component name and stack trace.
          </p>
          <CodeBlock
            code={`<KpiCard
  title="Revenue"
  value={0}
  error={{ message: "Failed to load data", onRetry: () => refetch() }}
/>`}
          />
        </DocSection>

        <DocSection id="stale" title="Stale">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Shows a subtle indicator that the data is outdated. The component still renders
            its value — just with a stale badge.
          </p>
          <CodeBlock
            code={`<KpiCard
  title="Revenue"
  value={142300}
  format="currency"
  stale={{ message: "Updated 5 min ago" }}
/>`}
          />
        </DocSection>

        <DocSection id="grouped" title="Grouped State Prop">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Instead of individual props, use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop
            to pass all states at once. This is cleaner when states come from a data-fetching hook.
          </p>
          <CodeBlock
            code={`const { data, isLoading, error } = useSWR("/api/revenue");

<KpiCard
  title="Revenue"
  value={data?.value ?? 0}
  format="currency"
  state={{
    loading: isLoading,
    error: error ? { message: error.message } : undefined,
    empty: !data ? { message: "No data" } : undefined,
  }}
/>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px]">state</code> prop
            takes precedence over individual loading/empty/error/stale props.
          </p>
        </DocSection>

        <DocSection id="global-defaults" title="Global Defaults">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set default empty and error state templates via MetricProvider:
          </p>
          <CodeBlock
            code={`<MetricProvider
  emptyState={{ message: "No data available" }}
  errorState={{ message: "Something went wrong" }}
>
  {/* All components inherit these defaults */}
</MetricProvider>`}
          />
        </DocSection>
      </div>

      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
