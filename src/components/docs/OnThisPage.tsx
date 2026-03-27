"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface OnThisPageProps {
  items: TocItem[];
  className?: string;
}

export function OnThisPage({ items, className }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting section
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={cn("space-y-1", className)}>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        On this page
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "block text-[12px] leading-snug transition-colors hover:text-[var(--foreground)]",
            item.level === 3 && "pl-3",
            activeId === item.id
              ? "font-medium text-[var(--accent)]"
              : "text-[var(--muted)]"
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
