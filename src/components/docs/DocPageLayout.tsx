"use client";

import { cn } from "@/lib/utils";
import { OnThisPage } from "./OnThisPage";
import type { TocItem } from "./OnThisPage";

export type { TocItem };

interface DocPageLayoutProps {
  tocItems: TocItem[];
  children: React.ReactNode;
  /** "prose" constrains width for guide/compare pages */
  maxWidth?: "prose";
}

/**
 * Two-column doc page shell — renders the content area with proper
 * padding and an OnThisPage sidebar (fixed-position, handled by
 * OnThisPage itself).
 */
export function DocPageLayout({
  tocItems,
  children,
  maxWidth,
}: DocPageLayoutProps) {
  return (
    <>
      <div
        className={cn(
          "px-8 py-8 2xl:pr-56",
          maxWidth === "prose" && "max-w-4xl",
        )}
      >
        {children}
      </div>
      <OnThisPage items={tocItems} />
    </>
  );
}
