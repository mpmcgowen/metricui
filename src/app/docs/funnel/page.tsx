"use client";

import { Funnel } from "@/components/charts/Funnel";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("funnel")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "conversion-rates", title: "Conversion Rates", level: 2 },
  { id: "horizontal", title: "Horizontal Layout", level: 2 },
  { id: "interpolation", title: "Linear Interpolation", level: 2 },
  { id: "simple-data", title: "Simple Data Format", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// Sample data
const conversionData = [
  { id: "visited", label: "Visited", value: 10000 },
  { id: "signed-up", label: "Signed Up", value: 4200 },
  { id: "activated", label: "Activated", value: 2800 },
  { id: "subscribed", label: "Subscribed", value: 1400 },
];

const onboardingData = [
  { id: "download", label: "Download", value: 8500 },
  { id: "install", label: "Install", value: 7200 },
  { id: "signup", label: "Sign Up", value: 5100 },
  { id: "onboard", label: "Onboarded", value: 3400 },
  { id: "active", label: "Active (7d)", value: 1800 },
];

export default function FunnelDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Funnel to visualize conversion pipelines — showing how values
        decrease through sequential stages like signup flows, sales pipelines,
        or onboarding processes. Supports vertical and horizontal layouts,
        smooth and linear interpolation, conversion rate annotations, and the
        simple data shorthand. For comparing categorical values, use{" "}
        <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
          BarChart
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
  ]}
  title="Conversion Funnel"
  height={360}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Funnel
              data={conversionData}
              title="Conversion Funnel"
              height={360}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Conversion Rates */}
      <DocSection id="conversion-rates" title="Conversion Rates">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">showConversionRate</code> to
          display percentage drop-off annotations between each stage.
        </p>
        <ComponentExample
          code={`<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
  ]}
  title="With Conversion Rates"
  showConversionRate
  height={360}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Funnel
              data={conversionData}
              title="With Conversion Rates"
              showConversionRate
              height={360}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Horizontal Layout */}
      <DocSection id="horizontal" title="Horizontal Layout">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">direction=&quot;horizontal&quot;</code> for
          a left-to-right funnel layout. Works well when horizontal space is plentiful
          and stage labels are short.
        </p>
        <ComponentExample
          code={`<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
  ]}
  title="Horizontal Funnel"
  direction="horizontal"
  showConversionRate
  height={280}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Funnel
              data={conversionData}
              title="Horizontal Funnel"
              direction="horizontal"
              showConversionRate
              height={280}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Linear Interpolation */}
      <DocSection id="interpolation" title="Linear Interpolation">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Switch from the default smooth curves to sharp linear edges with{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">interpolation=&quot;linear&quot;</code>.
          Combine with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">shapeBlending</code> to
          control how rectangular vs. tapered the stages appear.
        </p>
        <ComponentExample
          code={`<Funnel
  data={[
    { id: "download", label: "Download", value: 8500 },
    { id: "install", label: "Install", value: 7200 },
    { id: "signup", label: "Sign Up", value: 5100 },
    { id: "onboard", label: "Onboarded", value: 3400 },
    { id: "active", label: "Active (7d)", value: 1800 },
  ]}
  title="Onboarding Funnel"
  interpolation="linear"
  shapeBlending={0.4}
  showConversionRate
  height={400}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Funnel
              data={onboardingData}
              title="Onboarding Funnel"
              interpolation="linear"
              shapeBlending={0.4}
              showConversionRate
              height={400}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Simple Data Format */}
      <DocSection id="simple-data" title="Simple Data Format">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          For quick prototyping, pass a plain key-value object via{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">simpleData</code> instead
          of the full <code className="font-[family-name:var(--font-mono)] text-[12px]">FunnelDatumInput[]</code> array.
          Keys become labels and ids are auto-generated.
        </p>
        <ComponentExample
          code={`<Funnel
  simpleData={{
    Leads: 5000,
    Qualified: 2200,
    Proposal: 1100,
    Closed: 450,
  }}
  title="Sales Pipeline"
  showConversionRate
  height={340}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Funnel
              data={[]}
              simpleData={{
                Leads: 5000,
                Qualified: 2200,
                Proposal: 1100,
                Closed: 450,
              }}
              title="Sales Pipeline"
              showConversionRate
              height={340}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Data States */}
      <DocSection id="data-states" title="Data States">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Every component handles loading, empty, and error states.
          Pass individual props or use the grouped <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
            <Funnel
              data={[]}
              title="Conversion Funnel"
              loading
              height={240}
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <Funnel
              data={[]}
              title="Conversion Funnel"
              error={{ message: "Failed to load data" }}
              height={240}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<Funnel data={[]} title="Conversion Funnel" loading />

// Error state
<Funnel data={[]} title="Conversion Funnel" error={{ message: "Failed to load" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
