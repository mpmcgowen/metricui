"use client";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

interface ComponentExampleProps {
  code: string;
  children: React.ReactNode;
  className?: string;
}

export function ComponentExample({
  code,
  children,
  className,
}: ComponentExampleProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--card-border)]",
        className
      )}
    >
      {/* Live preview */}
      <div className="border-b border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="flex items-start justify-center">{children}</div>
      </div>

      {/* Code */}
      <CodeBlock code={code} className="rounded-none border-0" />
    </div>
  );
}
