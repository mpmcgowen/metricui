"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface ImportStatementProps {
  components: string[];
  from?: string;
  className?: string;
}

export function ImportStatement({
  components,
  from = "metricui",
  className,
}: ImportStatementProps) {
  const [copied, setCopied] = useState(false);
  const code = `import { ${components.join(", ")} } from "${from}";`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center overflow-hidden rounded-lg border border-[var(--card-border)] bg-[#0A0A0C] px-4 py-2.5",
        className
      )}
    >
      <code className="font-[family-name:var(--font-mono)] text-[13px] text-gray-300">
        <span className="text-purple-400">import</span>{" "}
        {"{ "}
        <span className="text-emerald-400">{components.join(", ")}</span>
        {" }"}{" "}
        <span className="text-purple-400">from</span>{" "}
        <span className="text-amber-300">&quot;{from}&quot;</span>
        <span className="text-gray-500">;</span>
      </code>

      <button
        onClick={handleCopy}
        className="ml-auto rounded-md p-1 text-gray-500 opacity-0 transition-all hover:text-gray-300 group-hover:opacity-100"
        aria-label="Copy import"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
