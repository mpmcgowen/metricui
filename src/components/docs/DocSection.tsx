"use client";

import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";

interface DocSectionProps {
  id: string;
  title: string;
  level?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function DocSection({
  id,
  title,
  level = 2,
  children,
  className,
}: DocSectionProps) {
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20",
        level === 2 ? "mt-14 first:mt-0" : "mt-10",
        className
      )}
    >
      <Tag className="group flex items-center gap-2">
        <a
          href={`#${id}`}
          className={cn(
            "flex items-center gap-2 text-[var(--foreground)] no-underline transition-colors hover:text-[var(--accent)]",
            level === 2
              ? "mb-4 text-xl font-bold"
              : "mb-3 text-base font-semibold"
          )}
        >
          {title}
          <LinkIcon className="h-4 w-4 text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      </Tag>
      {children}
    </section>
  );
}
