"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import type { PropDef } from "@/lib/docs/component-data";

interface PropsTableProps {
  props: PropDef[];
  className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
  const [search, setSearch] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);

  const activeProps = props.filter((p) => !p.deprecated);
  const deprecatedProps = props.filter((p) => p.deprecated);

  const filteredActive = search
    ? activeProps.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : activeProps;

  const filteredDeprecated = search
    ? deprecatedProps.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : deprecatedProps;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Filter props..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] py-2 pl-9 pr-3 font-[family-name:var(--font-mono)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Prop
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Type
              </th>
              <th className="hidden px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:table-cell">
                Default
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredActive.map((prop) => (
              <PropRow key={prop.name} prop={prop} />
            ))}
            {filteredActive.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-[13px] text-[var(--muted)]"
                >
                  No props match &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Deprecated props */}
      {deprecatedProps.length > 0 && (
        <div>
          <button
            onClick={() => setShowDeprecated(!showDeprecated)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                showDeprecated && "rotate-180"
              )}
            />
            {deprecatedProps.length} deprecated prop
            {deprecatedProps.length !== 1 && "s"}
          </button>

          {showDeprecated && (
            <div className="mt-2 overflow-x-auto rounded-xl border border-[var(--card-border)] opacity-70">
              <table className="w-full text-left">
                <tbody>
                  {filteredDeprecated.map((prop) => (
                    <PropRow key={prop.name} prop={prop} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PropRow({ prop }: { prop: PropDef }) {
  return (
    <tr className="border-b border-[var(--card-border)] last:border-0">
      <td className="px-4 py-2.5 align-top">
        <div className="flex items-center gap-1.5">
          <code
            className={cn(
              "font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--accent)]",
              prop.deprecated && "line-through opacity-60"
            )}
          >
            {prop.name}
          </code>
          {prop.required && (
            <span className="text-[11px] font-bold text-red-400" title="Required">
              *
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-2.5 align-top">
        <code className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--muted)]">
          {prop.type}
        </code>
      </td>
      <td className="hidden px-4 py-2.5 align-top sm:table-cell">
        {prop.default ? (
          <code className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--muted)]">
            {prop.default}
          </code>
        ) : (
          <span className="text-[12px] text-[var(--muted)]">&mdash;</span>
        )}
      </td>
      <td className="px-4 py-2.5 align-top">
        <p className="text-[13px] leading-relaxed text-[var(--foreground)]">
          {prop.description}
        </p>
        {prop.deprecated && (
          <p className="mt-1 text-[11px] font-medium text-amber-500">
            Deprecated: {prop.deprecated}
          </p>
        )}
      </td>
    </tr>
  );
}
