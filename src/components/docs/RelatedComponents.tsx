import Link from "next/link";
import { cn } from "@/lib/utils";
import { getComponentByName } from "@/lib/docs/component-data";
import { ArrowRight } from "lucide-react";

interface RelatedComponentsProps {
  names: string[];
  className?: string;
}

export function RelatedComponents({ names, className }: RelatedComponentsProps) {
  const components = names
    .map((name) => getComponentByName(name))
    .filter(Boolean);

  if (components.length === 0) return null;

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {components.map((comp) => (
        <Link
          key={comp!.slug}
          href={`/docs/${comp!.slug}`}
          className="group flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)]/30"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            {comp!.categoryLabel}
          </span>
          <span className="mt-1 text-[14px] font-semibold text-[var(--foreground)]">
            {comp!.name}
          </span>
          <span className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[var(--muted)]">
            {comp!.description}
          </span>
          <span className="mt-3 flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
            View docs <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      ))}
    </div>
  );
}
