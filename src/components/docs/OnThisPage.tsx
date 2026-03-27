"use client";

import { useEffect, useState, useCallback } from "react";
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

/**
 * "On this page" table of contents — dbt-style right-rail nav.
 *
 * Fixed position in the right margin. Highlights active section via
 * IntersectionObserver. Shows a thin accent bar next to the active item.
 * Hidden on screens narrower than 2xl (content gets full width).
 */
export function OnThisPage({ items, className }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash without jumping
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    [],
  );

  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "fixed right-6 top-20 hidden w-44 2xl:block",
        className,
      )}
      aria-label="On this page"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
        On this page
      </p>
      <div className="relative border-l border-[var(--card-border)]">
        {/* Active indicator bar */}
        {items.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <div key={item.id} className="relative">
              {/* Accent bar for active item */}
              {isActive && (
                <div
                  className="absolute left-0 top-0 h-full w-[2px] bg-[var(--accent)] transition-all duration-200"
                  style={{ borderRadius: 1 }}
                />
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "block py-1.5 pl-3 text-[12px] leading-snug transition-colors duration-150",
                  item.level === 3 && "pl-6",
                  isActive
                    ? "font-medium text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                {item.title}
              </a>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
