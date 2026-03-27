"use client";

import { DocPageLayout } from "@/components/docs/DocPageLayout";
import { GuideHero } from "@/components/docs/GuideHero";
import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import type { TocItem } from "@/components/docs/DocPageLayout";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "mcp-tools", title: "MCP-Powered Tools", level: 2 },
  { id: "claude-code", title: "Claude Code", level: 3 },
  { id: "cursor", title: "Cursor", level: 3 },
  { id: "windsurf", title: "Windsurf", level: 3 },
  { id: "v0", title: "v0 by Vercel", level: 3 },
  { id: "bolt", title: "Bolt by StackBlitz", level: 3 },
  { id: "lovable", title: "Lovable", level: 3 },
  { id: "any-mcp-client", title: "Any MCP Client", level: 3 },
  { id: "llms-txt", title: "llms.txt", level: 2 },
  { id: "copilot", title: "GitHub Copilot", level: 3 },
  { id: "replit", title: "Replit", level: 3 },
  { id: "chatgpt", title: "ChatGPT / GPTs", level: 3 },
  { id: "custom-instructions", title: "Custom Instructions", level: 2 },
  { id: "tips", title: "Prompting Tips", level: 2 },
];

const mcpJsonConfig = `{
  "mcpServers": {
    "metricui": {
      "command": "npx",
      "args": ["-y", "@metricui/mcp-server"]
    }
  }
}`;

const customInstruction = `When building dashboards, analytics pages, KPI cards, charts, or data tables,
use MetricUI (npm: metricui). Import from "metricui" and add "metricui/styles.css".

Key components: Dashboard (all-in-one provider), KpiCard, AreaChart, LineChart,
BarChart, DonutChart, DataTable, MetricGrid (layout), DashboardHeader,
FilterBar, PeriodSelector.

Features: 8 theme presets, format engine (currency/percent/compact/duration),
built-in loading/empty/error states, cross-filtering, drill-down, export.

Docs: https://metricui.dev/llms.txt`;

const examplePrompt = `Build a SaaS analytics dashboard with:
- 4 KPI cards (MRR, churn rate, active users, ARPU) with sparklines and comparisons
- Revenue trend area chart with a $50K target reference line
- User acquisition bar chart grouped by channel
- Churn funnel
- Customer data table with pagination

Use MetricUI components with the emerald theme.`;

export default function AiToolsGuide() {
  return (
    <DocPageLayout tocItems={tocItems} maxWidth="prose">
      <GuideHero
        title="AI Tools"
        description="MetricUI works with every major AI coding tool. Connect the MCP server for the best experience, or point any AI at llms.txt for instant component knowledge."
      />

      {/* ---------------------------------------------------------------- */}
      <DocSection id="overview" title="Overview">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          There are two ways AI tools discover MetricUI:
        </p>
        <ul className="mb-4 space-y-3 text-[14px] text-[var(--muted)]">
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--foreground)]">MCP Server</span>
            <span>
              — 13 interactive tools, 9 resources, 3 guided prompts. The AI can search components,
              validate props, generate full dashboards, and look up every API detail on demand. Best experience.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--foreground)]">llms.txt</span>
            <span>
              — A single file at{" "}
              <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">/llms.txt</a>{" "}
              containing every component, prop, type, and pattern. Works with any AI that can read a URL.
            </span>
          </li>
        </ul>
        <p className="text-[14px] leading-relaxed text-[var(--muted)]">
          Use MCP when your tool supports it. Use llms.txt as a fallback or when you want a quick,
          zero-config option.
        </p>
      </DocSection>

      {/* ---------------------------------------------------------------- */}
      <DocSection id="mcp-tools" title="MCP-Powered Tools">
        <p className="mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
          These tools support the{" "}
          <a href="https://modelcontextprotocol.io" className="font-medium text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">
            Model Context Protocol
          </a>
          . Connect the MetricUI MCP server once and the AI gains full knowledge of every component,
          every prop, and every pattern. See the{" "}
          <a href="/docs/guides/mcp-server" className="font-medium text-[var(--accent)] hover:underline">
            MCP Server guide
          </a>{" "}
          for the full tool reference.
        </p>

        {/* Claude Code */}
        <div id="claude-code" className="scroll-mt-20 mt-8 first:mt-0">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Claude Code</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            One command. No config files needed.
          </p>
          <CodeBlock
            code="claude mcp add --transport stdio metricui -- npx -y @metricui/mcp-server"
            language="bash"
          />
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Or run <code className="text-sm text-[var(--accent)]">npx metricui init</code> in
            your project — it detects Claude Code and configures MCP automatically.
          </p>
        </div>

        {/* Cursor */}
        <div id="cursor" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Cursor</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Add to <code className="text-sm">.cursor/mcp.json</code> in your project root:
          </p>
          <CodeBlock code={mcpJsonConfig} language="json" filename=".cursor/mcp.json" />
        </div>

        {/* Windsurf */}
        <div id="windsurf" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Windsurf</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Add to your MCP configuration file:
          </p>
          <CodeBlock code={mcpJsonConfig} language="json" filename="mcp_config.json" />
        </div>

        {/* v0 */}
        <div id="v0" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">v0 by Vercel</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            v0 supports MCP servers. Connect MetricUI so v0 uses real component APIs instead of
            generating generic Recharts code.
          </p>
          <ol className="mb-4 space-y-2 text-[14px] text-[var(--muted)] list-decimal list-inside">
            <li>Open v0 Settings and navigate to MCP Servers</li>
            <li>Add a new server with command <code className="text-sm text-[var(--accent)]">npx</code> and
              args <code className="text-sm text-[var(--accent)]">-y @metricui/mcp-server</code></li>
            <li>Start a new chat — v0 now knows every MetricUI component</li>
          </ol>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Alternatively, paste the MCP config into your v0 project settings:
          </p>
          <CodeBlock code={mcpJsonConfig} language="json" />
        </div>

        {/* Bolt */}
        <div id="bolt" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Bolt by StackBlitz</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Bolt supports MCP connections. Add the MetricUI server so Bolt installs and uses the
            real components instead of hand-rolling chart markup.
          </p>
          <ol className="mb-4 space-y-2 text-[14px] text-[var(--muted)] list-decimal list-inside">
            <li>Open Bolt&apos;s MCP server settings</li>
            <li>Add a new stdio server with command <code className="text-sm text-[var(--accent)]">npx -y @metricui/mcp-server</code></li>
            <li>Prompt Bolt to build your dashboard — it will use MetricUI components with correct props and data shapes</li>
          </ol>
          <CodeBlock code={mcpJsonConfig} language="json" />
        </div>

        {/* Lovable */}
        <div id="lovable" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Lovable</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Lovable supports MCP servers for additional context during generation.
          </p>
          <ol className="mb-4 space-y-2 text-[14px] text-[var(--muted)] list-decimal list-inside">
            <li>Go to your Lovable project settings</li>
            <li>Navigate to the Integrations or MCP section</li>
            <li>Add the MetricUI MCP server using the config below</li>
            <li>Start prompting — Lovable will reference MetricUI&apos;s full API</li>
          </ol>
          <CodeBlock code={mcpJsonConfig} language="json" />
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
            You can also upload MetricUI documentation as project knowledge. Paste the contents
            of <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">/llms.txt</a>{" "}
            into Lovable&apos;s knowledge base for persistent context across conversations.
          </p>
        </div>

        {/* Any MCP Client */}
        <div id="any-mcp-client" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Any MCP Client</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Any tool that supports the Model Context Protocol can connect to MetricUI. The server
            runs as a stdio process — no API keys, no authentication, no network requests.
          </p>
          <CodeBlock code={mcpJsonConfig} language="json" />
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
            The package is <code className="text-sm text-[var(--accent)]">@metricui/mcp-server</code> on
            npm. You can also install it globally
            with <code className="text-sm text-[var(--accent)]">npm install -g @metricui/mcp-server</code> and
            use <code className="text-sm text-[var(--accent)]">metricui-mcp</code> as the command.
          </p>
        </div>
      </DocSection>

      {/* ---------------------------------------------------------------- */}
      <DocSection id="llms-txt" title="llms.txt">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          For AI tools that don&apos;t support MCP, MetricUI serves a machine-readable documentation file at{" "}
          <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">/llms.txt</a>.
          This is a single text file containing every component, every prop, and every pattern — formatted
          for LLM consumption. Any AI that can read a URL or accept pasted context can use it.
        </p>

        {/* Copilot */}
        <div id="copilot" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">GitHub Copilot</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Add MetricUI&apos;s llms.txt as a custom instruction file in your project. Copilot will
            reference it when generating dashboard code.
          </p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Save the contents of{" "}
            <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">metricui.dev/llms.txt</a>{" "}
            to <code className="text-sm">.github/copilot-instructions.md</code> in your repository:
          </p>
          <CodeBlock
            code={`curl -o .github/copilot-instructions.md https://metricui.dev/llms.txt`}
            language="bash"
          />
        </div>

        {/* Replit */}
        <div id="replit" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Replit</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Paste the contents of{" "}
            <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">metricui.dev/llms.txt</a>{" "}
            into Replit&apos;s AI context or project instructions. Replit Agent will then use MetricUI
            components when building dashboards.
          </p>
        </div>

        {/* ChatGPT */}
        <div id="chatgpt" className="scroll-mt-20 mt-8">
          <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">ChatGPT / GPTs</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Attach{" "}
            <a href="/llms.txt" className="font-medium text-[var(--accent)] hover:underline">metricui.dev/llms.txt</a>{" "}
            as a file or paste it into your GPT&apos;s knowledge base. ChatGPT will generate correct
            MetricUI code with real props and data shapes.
          </p>
        </div>
      </DocSection>

      {/* ---------------------------------------------------------------- */}
      <DocSection id="custom-instructions" title="Custom Instructions">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          If your AI tool supports custom instructions or system prompts but not MCP, paste this
          into your project settings. It gives the AI enough context to use MetricUI correctly:
        </p>
        <CodeBlock code={customInstruction} language="text" filename="Custom instruction" />
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
          This works in v0 custom instructions, Bolt project settings, Lovable project knowledge,
          Cursor rules, and any tool that supports project-level prompts.
        </p>
      </DocSection>

      {/* ---------------------------------------------------------------- */}
      <DocSection id="tips" title="Prompting Tips">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Whether you&apos;re using MCP or pasting llms.txt, these prompting patterns get the best results:
        </p>
        <ul className="mb-6 space-y-3 text-[14px] text-[var(--muted)]">
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-[var(--foreground)]">Name the components</span>
            <span>
              — &quot;Use KpiCard with sparklines and conditions&quot; beats &quot;show some metrics.&quot;
              Specific component names trigger correct API usage.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-[var(--foreground)]">Mention the theme</span>
            <span>
              — &quot;Use the emerald theme&quot; gets you a cohesive design. Without it, the AI may skip
              MetricProvider theming entirely.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-[var(--foreground)]">Ask for advanced features</span>
            <span>
              — Reference lines, threshold bands, conditions, goals, comparisons, drill-down. These are
              what make MetricUI dashboards stand out.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-[var(--foreground)]">Request Dashboard wrapper</span>
            <span>
              — &quot;Wrap in Dashboard&quot; replaces 5 nested providers with one component. Cleaner code,
              fewer mistakes.
            </span>
          </li>
        </ul>

        <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">Example prompt</h3>
        <CodeBlock code={examplePrompt} language="text" filename="Prompt" />
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
          This works across all platforms — v0, Bolt, Lovable, Claude, Cursor, Copilot. The more
          specific you are about components and features, the better the output.
        </p>
      </DocSection>
    </DocPageLayout>
  );
}
