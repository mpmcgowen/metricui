interface GuideHeroProps {
  /** Badge label above the title. Default: "Guide" */
  label?: string;
  title: string;
  description: string;
}

/**
 * Hero header for guide and compare pages — replaces the repeated
 * label + h1 + description pattern.
 */
export function GuideHero({ label = "Guide", title, description }: GuideHeroProps) {
  return (
    <div>
      <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
        {label}
      </span>
      <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}
