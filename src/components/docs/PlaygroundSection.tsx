import { DocSection } from "./DocSection";

interface PlaygroundSectionProps {
  children: React.ReactNode;
}

/**
 * Playground wrapper — renders the DocSection, intro paragraph,
 * and rounded border container used on every component page
 * that has an interactive playground.
 */
export function PlaygroundSection({ children }: PlaygroundSectionProps) {
  return (
    <DocSection id="playground" title="Playground">
      <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
        Experiment with every prop interactively. Adjust the controls on the
        right to see the component update in real time.
      </p>
      <div className="rounded-xl border border-[var(--card-border)]">
        {children}
      </div>
    </DocSection>
  );
}
