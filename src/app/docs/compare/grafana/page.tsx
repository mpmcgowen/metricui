"use client";

import { DocSection } from "@/components/docs/DocSection";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { ComparisonDemo } from "@/components/docs/ComparisonDemo";

const tocItems: TocItem[] = [
  { id: "tldr", title: "TL;DR", level: 2 },
  { id: "what-is-grafana", title: "What is Grafana?", level: 2 },
  { id: "what-is-metricui", title: "What is MetricUI?", level: 2 },
  { id: "fundamental-difference", title: "The Fundamental Difference", level: 2 },
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "data-model", title: "Data Model", level: 2 },
  { id: "embedding", title: "Embedding & Integration", level: 2 },
  { id: "theming", title: "Theming & Branding", level: 2 },
  { id: "licensing", title: "Licensing", level: 2 },
  { id: "comparison-table", title: "Comparison Table", level: 2 },
  { id: "when-grafana", title: "When to Choose Grafana", level: 2 },
  { id: "when-metricui", title: "When to Choose MetricUI", level: 2 },
  { id: "use-both", title: "Can You Use Both?", level: 2 },
  { id: "see-it-live", title: "See It In Action", level: 2 },
  { id: "bottom-line", title: "The Bottom Line", level: 2 },
];

export default function GrafanaComparisonPage() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-5xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Compare
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MetricUI vs Grafana
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Two excellent dashboard tools that solve fundamentally different
          problems. Grafana is the gold standard for infrastructure monitoring.
          MetricUI is a React component library for product dashboards. Here is
          how to decide which one you need — or whether you need both.
        </p>

        {/* ── TL;DR ────────────────────────────────────────────────── */}
        <DocSection id="tldr" title="TL;DR">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you are searching for &ldquo;dashboard framework&rdquo; and
            landing on both MetricUI and Grafana, you are probably comparing
            apples to oranges. Grafana is a standalone observability platform
            designed for DevOps teams monitoring infrastructure. MetricUI is an
            npm package that gives React developers ready-made dashboard
            components they drop into their own applications. Different
            audiences, different architectures, different use cases.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The short version: use Grafana to watch your servers. Use MetricUI
            to build the analytics pages your customers see.
          </p>
        </DocSection>

        {/* ── What is Grafana? ─────────────────────────────────────── */}
        <DocSection id="what-is-grafana" title="What is Grafana?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Grafana is an open-source observability and monitoring platform,
            currently on the v11.x line. It connects to time-series databases
            like Prometheus, InfluxDB, Elasticsearch, and Loki, then lets you
            build dashboards that visualize those metrics in real time. It is
            best-in-class at what it does — if you need to watch CPU usage,
            request latency, error rates, or log volumes across a fleet of
            servers, Grafana is the answer.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Grafana runs as a server. You either self-host it or use Grafana
            Cloud. Dashboards are built in Grafana&apos;s own UI using its panel
            editor and query builders. The result is a dedicated web application
            — a destination your team navigates to.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Its ecosystem is enormous: hundreds of data source plugins,
            thousands of community dashboards, alerting, annotations, and a
            mature plugin SDK. For SRE and platform engineering teams, it is
            essentially infrastructure.
          </p>
        </DocSection>

        {/* ── What is MetricUI? ────────────────────────────────────── */}
        <DocSection id="what-is-metricui" title="What is MetricUI?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a React component library purpose-built for product
            dashboards. You install it from npm, import the components you need,
            pass your data as props, and render them inside your existing React
            application. No server to run, no infrastructure to manage.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            It ships 44 components across 18 chart types, plus KPI cards,
            filters, cross-filtering, drill-down, export, and AI-powered
            insights. Eight built-in themes let you match your product&apos;s
            design system out of the box, or you can define a fully custom
            theme.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is designed for product teams that need to ship
            customer-facing analytics — the usage dashboard in your SaaS app,
            the reporting page in your admin panel, the analytics view in your
            internal tool. It is building material, not a destination.
          </p>
        </DocSection>

        {/* ── The Fundamental Difference ───────────────────────────── */}
        <DocSection
          id="fundamental-difference"
          title="The Fundamental Difference"
        >
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The core distinction between MetricUI vs Grafana comes down to a
            single question: are you building a dashboard, or are you visiting
            one?
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">
              Grafana is a destination.
            </strong>{" "}
            It is a full application with its own URL, its own auth, its own UI.
            Your team opens a browser tab, navigates to your Grafana instance,
            and looks at dashboards. The dashboards live inside Grafana.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">
              MetricUI is building material.
            </strong>{" "}
            It is a set of React components that live inside your application.
            Your users never leave your product. The dashboard is part of your
            app, rendered by your code, styled to match your brand. There is no
            second application to run.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            This is not a quality difference — it is a category difference. A
            hammer and a screwdriver are both excellent tools. You just need to
            know which fastener you are working with.
          </p>
        </DocSection>

        {/* ── Architecture ─────────────────────────────────────────── */}
        <DocSection id="architecture" title="Architecture">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Grafana</strong> is a
            server-side platform. It requires a running Grafana server (Go
            backend, SQLite/PostgreSQL for config storage) plus one or more data
            source backends like Prometheus. You deploy it, configure data
            sources, create dashboards in the Grafana UI, and manage users and
            permissions through its admin panel. Grafana Cloud handles this
            hosting for you, but the architecture is the same: a separate
            application your team connects to.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">MetricUI</strong> is a
            client-side npm package. You run{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              npm install metricui
            </code>
            , import components, and render them in your React app. There is no
            server, no config database, no admin panel. Your existing React
            application is the platform. Your existing API is the data source.
            MetricUI is just the visualization layer.
          </p>
        </DocSection>

        {/* ── Data Model ───────────────────────────────────────────── */}
        <DocSection id="data-model" title="Data Model">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is where the MetricUI vs Grafana comparison gets most
            practical.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Grafana</strong> pulls
            data from configured data sources using its query language (PromQL,
            LogQL, Flux, etc.). You do not pass data to Grafana — you tell it
            where to find data, and it queries those sources directly. This is
            extremely powerful for infrastructure metrics that already live in
            Prometheus or InfluxDB, but it means your data must exist in a
            Grafana-compatible data source. Business data in your PostgreSQL
            database requires an additional data source plugin and often
            significant query work.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">MetricUI</strong> takes
            data as props. You fetch data however you already do — REST API,
            GraphQL, tRPC, server components, SWR, React Query — and pass it to
            the component. Any shape, any source, any format. If you can get it
            into a JavaScript array, MetricUI can render it. You own the data
            pipeline completely.
          </p>
        </DocSection>

        {/* ── Embedding & Integration ──────────────────────────────── */}
        <DocSection id="embedding" title="Embedding & Integration">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you need dashboards inside your product — not on a separate
            Grafana URL — the integration story is very different between these
            two tools.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Grafana</strong>{" "}
            supports embedding via iframes. Each embedded panel or dashboard
            loads a full Grafana page inside the iframe, which means a separate
            page load, separate auth handling, and limited control over styling.
            For multi-tenant SaaS applications, each customer needs scoped
            access, which adds significant authentication complexity. Note that{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              @grafana/ui
            </code>{" "}
            and{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              @grafana/scenes
            </code>{" "}
            exist on npm, but these are for building Grafana plugins — not for
            embedding Grafana charts in external React applications.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">MetricUI</strong>{" "}
            components render as native React elements in your component tree.
            No iframes, no separate auth, no extra page loads. They participate
            in your React state, respond to your context providers, and render
            in the same DOM as the rest of your application. Multi-tenant
            scoping is just a matter of which data you pass as props.
          </p>
        </DocSection>

        {/* ── Theming & Branding ───────────────────────────────────── */}
        <DocSection id="theming" title="Theming & Branding">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Grafana</strong> ships
            with built-in light and dark themes. Customization beyond that is
            limited unless you are on Grafana Enterprise, which supports
            white-labeling (custom logos, colors, login page). The standard
            open-source version looks like Grafana — and your users will
            recognize it.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">MetricUI</strong> ships
            8 theme presets (indigo, emerald, rose, amber, cyan, violet, slate,
            orange) and supports fully custom themes. Every component uses CSS
            custom properties, so they inherit your application&apos;s design
            tokens. Your dashboard looks like your product, not like a
            third-party tool. For SaaS applications where brand consistency
            matters, this distinction is significant.
          </p>
        </DocSection>

        {/* ── Licensing ────────────────────────────────────────────── */}
        <DocSection id="licensing" title="Licensing">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is a detail that matters more than most people realize,
            especially for SaaS companies.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Grafana</strong> is
            licensed under AGPL v3 (changed from Apache 2.0 in Grafana v7). The
            AGPL requires that if you modify Grafana and provide it as a network
            service, you must release your modifications as open source. For
            internal use this is rarely a problem, but if you are embedding
            Grafana in a commercial SaaS product, the AGPL has real
            implications. Grafana offers a commercial license for this scenario,
            but it comes with Enterprise pricing.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">MetricUI</strong> is
            MIT licensed. Use it in any project, commercial or otherwise, with
            no obligations. There are no copyleft concerns for embedding it in
            your SaaS product.
          </p>
        </DocSection>

        {/* ── Comparison Table ─────────────────────────────────────── */}
        <DocSection id="comparison-table" title="Comparison Table">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-[var(--muted)]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-3 pr-4 text-left font-semibold text-[var(--foreground)]">
                    &nbsp;
                  </th>
                  <th className="py-3 pr-4 text-left font-semibold text-[var(--foreground)]">
                    Grafana
                  </th>
                  <th className="py-3 text-left font-semibold text-[var(--foreground)]">
                    MetricUI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Type
                  </td>
                  <td className="py-3 pr-4">Standalone platform</td>
                  <td className="py-3">npm component library</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Target audience
                  </td>
                  <td className="py-3 pr-4">DevOps, SRE, platform eng</td>
                  <td className="py-3">Product teams, frontend devs</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Primary use case
                  </td>
                  <td className="py-3 pr-4">Infrastructure monitoring</td>
                  <td className="py-3">Customer-facing dashboards</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Runs as
                  </td>
                  <td className="py-3 pr-4">Server (self-hosted or cloud)</td>
                  <td className="py-3">React components in your app</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Data input
                  </td>
                  <td className="py-3 pr-4">
                    Query configured data sources
                  </td>
                  <td className="py-3">Props (any shape, any source)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Embedding
                  </td>
                  <td className="py-3 pr-4">Iframe (requires server)</td>
                  <td className="py-3">Native React components</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Themes
                  </td>
                  <td className="py-3 pr-4">Light/dark (Enterprise for custom)</td>
                  <td className="py-3">8 presets + fully custom</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    License
                  </td>
                  <td className="py-3 pr-4">AGPL v3</td>
                  <td className="py-3">MIT</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Pricing
                  </td>
                  <td className="py-3 pr-4">
                    OSS free, Cloud Pro ~$29/mo + usage
                  </td>
                  <td className="py-3">Free core, Pro for premium components</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Chart types
                  </td>
                  <td className="py-3 pr-4">
                    Time-series focused (+ plugins)
                  </td>
                  <td className="py-3">18 types, 44 components</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    Alerting
                  </td>
                  <td className="py-3 pr-4">Built-in, production-grade</td>
                  <td className="py-3">Not in scope (use your backend)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    AI features
                  </td>
                  <td className="py-3 pr-4">Grafana AI (query assistant)</td>
                  <td className="py-3">DashboardInsight, AI context, chat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ── When to Choose Grafana ───────────────────────────────── */}
        <DocSection id="when-grafana" title="When to Choose Grafana">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Grafana is the right choice when:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You need to monitor infrastructure — servers, containers,
              Kubernetes clusters, network devices
            </li>
            <li>
              Your data already lives in Prometheus, InfluxDB, Elasticsearch, or
              other time-series databases
            </li>
            <li>
              Your audience is your internal engineering, SRE, or DevOps team
            </li>
            <li>
              You need production alerting with escalation policies and
              notification channels
            </li>
            <li>
              You want a standalone monitoring application with its own URL and
              access controls
            </li>
            <li>
              You need to correlate metrics, logs, and traces in a single
              platform
            </li>
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            For these use cases, Grafana is genuinely unmatched. Its plugin
            ecosystem, query language support, and alerting capabilities are the
            result of over a decade of focused development. Do not try to
            replicate this with a component library.
          </p>
        </DocSection>

        {/* ── When to Choose MetricUI ──────────────────────────────── */}
        <DocSection id="when-metricui" title="When to Choose MetricUI">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is the right choice when:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You are building customer-facing analytics — usage dashboards,
              reporting pages, admin panels
            </li>
            <li>
              The dashboard must look like part of your product, not a
              third-party tool
            </li>
            <li>
              Your data comes from your own API, database, or data warehouse —
              not from Prometheus
            </li>
            <li>
              You need the dashboard to participate in your React state,
              routing, and component lifecycle
            </li>
            <li>
              You are a SaaS company and need MIT licensing without AGPL
              concerns
            </li>
            <li>
              You want interactive features like cross-filtering, drill-down,
              and export built in
            </li>
            <li>
              You need to ship fast — install from npm and start rendering, no
              infrastructure to provision
            </li>
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            If your users are your customers (not your engineering team), and
            your data is your business data (not your infrastructure metrics),
            MetricUI is designed specifically for this.
          </p>
        </DocSection>

        {/* ── Can You Use Both? ────────────────────────────────────── */}
        <DocSection id="use-both" title="Can You Use Both?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Yes — and many teams should.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The MetricUI vs Grafana decision is not either-or. These tools
            occupy completely different parts of your stack. A common and
            sensible setup looks like this:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Grafana</strong> for
              your internal ops team — monitoring application performance, server
              health, error rates, and deployment metrics. Your engineers open
              Grafana when something alerts.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">MetricUI</strong> for
              your product — the analytics dashboard your customers see when they
              log in. Usage stats, billing summaries, performance reports,
              activity feeds. This lives inside your React app and looks like the
              rest of your product.
            </li>
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            They might even show some of the same underlying data, just framed
            differently. Your Grafana dashboard shows request latency as an SRE
            metric with alerting thresholds. Your MetricUI dashboard shows the
            same latency data to your customer as &ldquo;API response
            time&rdquo; in a polished card with a sparkline. Same data, different
            audience, different tool.
          </p>
        </DocSection>

        {/* ── See It In Action ─────────────────────────────────────── */}
        <DocSection id="see-it-live" title="See It In Action">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is what a MetricUI dashboard looks like — built from a single CSV
            with 25 lines of code. No server, no infrastructure, no iframe.
          </p>
          <ComparisonDemo />
        </DocSection>

        {/* ── The Bottom Line ──────────────────────────────────────── */}
        <DocSection id="bottom-line" title="The Bottom Line">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Grafana is an observability platform. MetricUI is a dashboard
            component library. Grafana is where your team goes to monitor
            infrastructure. MetricUI is what you use to build the analytics
            pages inside your product.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you are an SRE team looking for a monitoring stack, Grafana is
            the answer. If you are a product team looking to ship
            customer-facing dashboards in your React app, MetricUI is the
            answer. If you are both — and most growing companies are — use both.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The right tool for the right job. Grafana has been perfecting
            infrastructure observability for over a decade. MetricUI exists so
            you do not have to bend an observability platform into a product
            dashboard framework — or build one from scratch.
          </p>
        </DocSection>
      </div>

      <aside className="sticky top-8 hidden h-fit w-48 shrink-0 py-8 pl-4 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  );
}
