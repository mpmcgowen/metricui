"use client";

import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const component = getComponent("ai-insights")!;

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "floating-chat", title: "Floating Chat", level: 2 },
  { id: "mentions", title: "@ Mentions", level: 2 },
  { id: "three-level-context", title: "Three-Level Context", level: 2 },
  { id: "auto-data-collection", title: "Auto Data Collection", level: 2 },
  { id: "per-card-ai-icon", title: "Per-Card AI Icon", level: 2 },
  { id: "quick-prompts", title: "Quick Prompts", level: 2 },
  { id: "streaming", title: "Streaming", level: 2 },
  { id: "chat-persistence", title: "Chat Persistence", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function AiInsightsDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        <p className="mt-4 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[13px] leading-relaxed text-[var(--muted)]">
          See the live AI chat in action on any demo dashboard:{" "}
          <a href="/demos/analytics" className="font-medium text-[var(--accent)] hover:underline">Web Analytics</a>{" "}
          and{" "}
          <a href="/demos/saas" className="font-medium text-[var(--accent)] hover:underline">SaaS Analytics</a>.
        </p>

        {/* Overview */}
        <DocSection id="overview" title="Overview">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            AI Insights is not a single component you import &mdash; it is a{" "}
            <strong className="font-semibold text-[var(--foreground)]">system</strong> that spans
            four layers of your dashboard:
          </p>
          <ul className="space-y-2">
            {[
              "Dashboard ai prop — configures the LLM connection, company context, and dashboard context.",
              "AiContext provider — automatically wraps your dashboard, manages registered metrics, chat state, and the system prompt.",
              "CardShell auto-registration — every KpiCard, chart, and DataTable automatically registers its live data with AiContext. No manual wiring.",
              "DashboardInsight — the floating chat UI. Renders the button, sidebar panel, quick prompts, @ mention picker, and streaming responses.",
            ].map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The philosophy is{" "}
            <strong className="font-semibold text-[var(--foreground)]">BYO LLM</strong>.
            MetricUI never calls an API on your behalf. You provide an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">analyze</code>{" "}
            function that takes messages and returns text (or an async iterable for streaming).
            Use OpenAI, Anthropic, a local model, or anything else. MetricUI handles the context
            assembly, UI, and streaming &mdash; your function handles the LLM call.
          </p>
        </DocSection>

        {/* Setup */}
        <DocSection id="setup" title="Setup">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">ai</code>{" "}
            prop to Dashboard. At minimum, you need an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">analyze</code>{" "}
            function. Add{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">DashboardInsight</code>{" "}
            anywhere inside the Dashboard to render the chat UI.
          </p>
          <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">
            Minimal setup (3 lines)
          </p>
          <CodeBlock
            code={`import { Dashboard, DashboardInsight } from "metricui";

<Dashboard ai={{ analyze: (msgs) => fetch("/api/ai", { method: "POST", body: JSON.stringify(msgs) }).then(r => r.text()) }}>
  <DashboardInsight />
  {/* your cards and charts */}
</Dashboard>`}
          />
          <p className="mb-2 mt-6 text-[12px] font-medium text-[var(--muted)]">
            Full setup with company + context + aiContext
          </p>
          <CodeBlock
            code={`import { Dashboard, DashboardInsight, KpiCard, BarChart } from "metricui";

async function analyze(messages, { signal }) {
  const res = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify(messages),
    signal,
  });
  return res.text();
}

<Dashboard
  theme="emerald"
  ai={{
    analyze,
    company: "Acme Corp — B2B SaaS, Series B, selling to mid-market HR teams.",
    context: "This is the weekly growth dashboard. Targets: MRR > $500K, churn < 3%.",
    tone: "executive",
  }}
>
  <KpiCard
    title="MRR"
    value={487000}
    format="currency"
    aiContext="Monthly recurring revenue. Includes expansion but not one-time fees."
  />
  <BarChart
    data={channelData}
    index="channel"
    categories={["signups"]}
    title="Signups by Channel"
    aiContext="Organic includes SEO + content. Paid includes Google Ads + LinkedIn."
  />
  <DashboardInsight />
</Dashboard>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Here is an example API route (Next.js route handler) that calls Claude:
          </p>
          <CodeBlock
            code={`// app/api/ai/route.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const messages = await req.json();

  // Separate system message from conversation
  const system = messages.find((m: any) => m.role === "system")?.content ?? "";
  const conversation = messages.filter((m: any) => m.role !== "system");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system,
    messages: conversation,
  });

  const text = response.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");

  return new Response(text);
}`}
            language="typescript"
          />
        </DocSection>

        {/* Floating Chat */}
        <DocSection id="floating-chat" title="Floating Chat">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            When AI is configured,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">DashboardInsight</code>{" "}
            renders a floating button in the bottom-right corner (configurable via the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">position</code>{" "}
            prop). Clicking it opens a slide-over sidebar panel with:
          </p>
          <ul className="space-y-2">
            {[
              "A header with the AI Insights title and a hint to use @ mentions.",
              "Quick prompt buttons (shown when the chat is empty).",
              "A scrollable message area with user bubbles and assistant responses.",
              "An input bar with mention chip display, send button, clear button, and abort button during streaming.",
            ].map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The floating button shows a badge count of assistant messages when there is
            an active conversation. The sidebar renders via React portal so it is never
            clipped by parent overflow.
          </p>
        </DocSection>

        {/* @ Mentions */}
        <DocSection id="mentions" title="@ Mentions">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Type{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">@</code>{" "}
            in the chat input to open a dropdown of all registered dashboard components.
            The list filters as you type. Navigate with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">Arrow Up</code>{" "}
            / <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">Arrow Down</code>,
            select with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">Enter</code>,
            dismiss with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">Escape</code>.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Selected mentions appear as chips above the input. You can select multiple
            components to scope a question. When you send a message with mentions, the
            mention titles are passed as{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">triggerContext</code>{" "}
            so the AI focuses its analysis on those specific components first, then connects
            to the broader dashboard.
          </p>
          <CodeBlock
            code={`// The user types: @MRR @Signups by Channel why is MRR flat when signups are up?
//
// MetricUI sends triggerContext: "MRR, Signups by Channel" and prepends
// a system message: "The user is asking specifically about: MRR, Signups by Channel.
// Start your analysis there but connect to other metrics as relevant."`}
          />
        </DocSection>

        {/* Three-Level Context */}
        <DocSection id="three-level-context" title="Three-Level Context">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The system prompt is assembled from three layers of context, each more specific
            than the last:
          </p>
          <DataTable
            data={[
              { level: "Company", prop: "ai.company", example: "Acme Corp — B2B SaaS, Series B, mid-market HR.", purpose: "Who you are. Industry, stage, ICP. Included in every prompt so the AI understands your business." },
              { level: "Dashboard", prop: "ai.context", example: "Weekly growth dashboard. Target: MRR > $500K.", purpose: "What this dashboard measures. Targets, recent changes, what matters right now." },
              { level: "Component", prop: "aiContext", example: "MRR includes expansion, not one-time fees.", purpose: "Per-card business context. Definitions, caveats, what makes this metric special." },
            ]}
            columns={[
              { key: "level", header: "Level", render: (v) => <span className="font-medium text-[var(--foreground)]">{String(v)}</span> },
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
              { key: "example", header: "Example" },
              { key: "purpose", header: "Purpose" },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Company and dashboard context go on the Dashboard{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">ai</code>{" "}
            prop. Component context goes on individual cards and charts via the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code>{" "}
            prop. All three are stitched into the system prompt automatically.
          </p>
        </DocSection>

        {/* Auto Data Collection */}
        <DocSection id="auto-data-collection" title="Auto Data Collection">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            CardShell automatically registers every component&apos;s data with AiContext when it
            mounts, and unregisters when it unmounts. You do not need to manually pass data to
            the AI system &mdash; it reads what your components already display.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The data is{" "}
            <strong className="font-semibold text-[var(--foreground)]">live</strong> &mdash; when
            filters change and your components re-render with new data, the AI context updates
            automatically. The AI always sees what the user sees.
          </p>
          <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">
            What gets sent to the AI (per component type)
          </p>
          <DataTable
            data={[
              { component: "KpiCard", dataSent: "Title, value, comparison values, description." },
              { component: "Charts (BarChart, AreaChart, etc.)", dataSent: "Title, full data array (up to 20 rows). For datasets > 20 rows: first 10 rows + column statistics (min, max, avg)." },
              { component: "DataTable", dataSent: "Title, full data array (up to 20 rows). For large tables: first 10 rows + column stats + total row count." },
            ]}
            columns={[
              { key: "component", header: "Component", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "dataSent", header: "Data Sent to AI" },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For large datasets, the system sends a sample (first 10 rows) plus per-column
            statistics (min, max, avg for numeric columns) so the AI can reason about
            distributions without the full payload.
          </p>
        </DocSection>

        {/* Per-Card AI Icon */}
        <DocSection id="per-card-ai-icon" title="Per-Card AI Icon">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            When AI is enabled, every card shows a small sparkle icon on hover (next to the
            export button, if present). Clicking it opens the AI chat sidebar with that
            component pre-selected as an @ mention.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            This is powered by the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">openWith</code>{" "}
            function on AiContext. CardShell calls{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">ai.openWith(title)</code>{" "}
            which triggers DashboardInsight to open with that title added to the selected
            mentions. The user can then type their question in the context of that specific
            component.
          </p>
        </DocSection>

        {/* Quick Prompts */}
        <DocSection id="quick-prompts" title="Quick Prompts">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            When the chat is empty, quick prompt buttons appear below the header. Clicking
            one immediately sends the prompt to the AI. Three defaults are provided:
            &quot;What&apos;s notable?&quot;, &quot;What&apos;s at risk?&quot;, and
            &quot;Summarize&quot;.
          </p>
          <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">
            Custom quick prompts
          </p>
          <CodeBlock
            code={`<DashboardInsight
  quickPrompts={[
    { label: "Growth check", prompt: "How is our growth trending? Focus on MRR and signup velocity." },
    { label: "Churn risk", prompt: "Which segments show early churn signals?" },
    { label: "Board summary", prompt: "Write a 3-sentence board update from this dashboard." },
  ]}
/>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">quickPrompts=&#123;false&#125;</code>{" "}
            to hide them entirely.
          </p>
        </DocSection>

        {/* Streaming */}
        <DocSection id="streaming" title="Streaming">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If your{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">analyze</code>{" "}
            function returns an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">AsyncIterable&lt;string&gt;</code>{" "}
            instead of a{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">Promise&lt;string&gt;</code>,
            tokens render incrementally as they arrive. A pulsing cursor indicates the
            stream is active. The user can click the abort button (X) to cancel mid-stream.
          </p>
          <CodeBlock
            code={`// Streaming analyze function
async function* analyze(messages, { signal }) {
  const res = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify(messages),
    signal,
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}

<Dashboard ai={{ analyze }}>
  <DashboardInsight />
</Dashboard>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The abort signal is passed through to your function. When the user clicks abort,
            the signal fires and the stream stops. Partial text is discarded and no assistant
            message is saved.
          </p>
        </DocSection>

        {/* Chat Persistence */}
        <DocSection id="chat-persistence" title="Chat Persistence">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            By default, chat messages are stored in React state &mdash; they persist across
            sidebar open/close but are lost on page refresh. For database persistence, use
            controlled mode with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">messages</code>{" "}
            and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onMessage</code>.
          </p>
          <CodeBlock
            code={`"use client";
import { useState, useEffect } from "react";
import { Dashboard, DashboardInsight } from "metricui";
import type { AiMessage } from "metricui";

function MyDashboard() {
  const [messages, setMessages] = useState<AiMessage[]>([]);

  // Load from database on mount
  useEffect(() => {
    fetch("/api/chat-history").then(r => r.json()).then(setMessages);
  }, []);

  // Save each message to database
  const onMessage = async (msg: AiMessage) => {
    setMessages(prev => [...prev, msg]);
    await fetch("/api/chat-history", {
      method: "POST",
      body: JSON.stringify(msg),
    });
  };

  return (
    <Dashboard
      ai={{
        analyze,
        messages,
        onMessage,
      }}
    >
      <DashboardInsight />
    </Dashboard>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            In controlled mode, MetricUI does not manage message state internally. Your{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onMessage</code>{" "}
            callback fires for both user and assistant messages. You own the state and
            persistence logic.
          </p>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {component.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI Insights analysis. See the <a href="/docs/ai-insights" className="font-medium text-[var(--accent)] hover:underline">AI Insights guide</a> for details.
            </li>
          </ul>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
