import { DocSection } from "./DocSection";

interface NotesListProps {
  notes: string[];
  /** Auto-append the aiContext note. Default: true */
  showAiContextNote?: boolean;
}

/**
 * Notes bullet list — renders a DocSection with accent-dot bullets
 * and an optional trailing aiContext note.
 */
export function NotesList({ notes, showAiContextNote = true }: NotesListProps) {
  return (
    <DocSection id="notes" title="Notes">
      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li
            key={i}
            className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
            {note}
          </li>
        ))}
        {showAiContextNote && (
          <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
              aiContext
            </code>{" "}
            prop (inherited from BaseComponentProps) adds business context for AI
            Insights analysis. See the{" "}
            <a
              href="/docs/ai-insights"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              AI Insights guide
            </a>{" "}
            for details.
          </li>
        )}
      </ul>
    </DocSection>
  );
}
