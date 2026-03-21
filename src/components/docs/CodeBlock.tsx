"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, FileCode } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--card-border)] bg-[#0A0A0C]",
        className
      )}
    >
      {/* Header with filename and copy button */}
      {filename && (
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
          <FileCode className="h-3.5 w-3.5 text-gray-500" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-gray-500">
            {filename}
          </span>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-3 top-3 rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-400 opacity-0 transition-all hover:bg-white/10 hover:text-gray-200 group-hover:opacity-100",
          filename && "top-11"
        )}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Code content */}
      <div className="overflow-x-auto p-4">
        <pre className="text-[13px] leading-relaxed">
          <code
            className="font-[family-name:var(--font-mono)] text-gray-300"
            data-language={language}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
