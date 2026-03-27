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
          "px-8 py-8",
          maxWidth === "prose" && "lg:max-w-3xl",
        )}
      >
        {children}
      </div>
      <OnThisPage items={tocItems} />
    </>
  );
}
