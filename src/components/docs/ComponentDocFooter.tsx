import { DocSection } from "./DocSection";
import { PropsTable } from "./PropsTable";
import { CodeBlock } from "./CodeBlock";
import { NotesList } from "./NotesList";
import { PlaygroundSection } from "./PlaygroundSection";
import { RelatedComponents } from "./RelatedComponents";
import type { DocComponent } from "@/lib/docs/component-data";

interface ComponentDocFooterProps {
  component: DocComponent;
  /** Extra notes to append before the aiContext note */
  extraNotes?: string[];
  /** Playground component to render */
  playground?: React.ReactNode;
}

/**
 * Standard footer for component doc pages — renders Props, Data Shape,
 * Notes, Playground, and Related Components in the canonical order.
 */
export function ComponentDocFooter({
  component,
  extraNotes,
  playground,
}: ComponentDocFooterProps) {
  const allNotes = [...component.notes, ...(extraNotes ?? [])];

  return (
    <>
      {/* Props */}
      <DocSection id="props" title="Props">
        <PropsTable props={component.props} />
      </DocSection>

      {/* Data Shape */}
      {component.dataShape && (
        <DocSection id="data-shape" title="Data Shape">
          <CodeBlock code={component.dataShape} language="typescript" />
        </DocSection>
      )}

      {/* Notes */}
      <NotesList notes={allNotes} />

      {/* Playground */}
      {playground && <PlaygroundSection>{playground}</PlaygroundSection>}

      {/* Related Components */}
      <DocSection id="related" title="Related Components">
        <RelatedComponents names={component.relatedComponents} />
      </DocSection>
    </>
  );
}
