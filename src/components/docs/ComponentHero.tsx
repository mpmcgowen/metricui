import { cn } from "@/lib/utils";
import { ImportStatement } from "./ImportStatement";
import type { DocComponent } from "@/lib/docs/component-data";

interface ComponentHeroProps {
  component: DocComponent;
  className?: string;
}

export function ComponentHero({ component, className }: ComponentHeroProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Category badge */}
      <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
        {component.categoryLabel}
      </span>

      {/* Title */}
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        {component.name}
      </h1>

      {/* Description */}
      <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
        {component.description}
      </p>

      {/* Import */}
      <ImportStatement
        components={[component.importName]}
        className="max-w-lg"
      />
    </div>
  );
}
