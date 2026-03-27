import { cn } from "@/lib/utils";

interface CodeProps {
  children: React.ReactNode;
  /** Smaller size variant */
  size?: "sm";
}

/**
 * Inline code span — replaces the repeated inline code class string
 * used across 300+ instances in doc pages.
 */
export function Code({ children, size }: CodeProps) {
  return (
    <code
      className={cn(
        "font-[family-name:var(--font-mono)] text-[var(--accent)]",
        size === "sm" ? "text-[12px]" : "text-[13px]",
      )}
    >
      {children}
    </code>
  );
}
