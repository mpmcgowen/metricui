"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

export function Toggle({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-3 py-2">
      <div>
        <span className="text-[13px] font-medium text-[var(--foreground)]">{label}</span>
        {description && (
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors",
          value ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
            value ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </button>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Text Input
// ---------------------------------------------------------------------------

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div className="py-2">
      <label className="text-[13px] font-medium text-[var(--foreground)]">{label}</label>
      {description && (
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{description}</p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Number Input
// ---------------------------------------------------------------------------

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}) {
  return (
    <div className="py-2">
      <label className="text-[13px] font-medium text-[var(--foreground)]">{label}</label>
      {description && (
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{description}</p>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step ?? 1}
        className="mt-1.5 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export function Select({
  label,
  value,
  onChange,
  options,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  description?: string;
}) {
  return (
    <div className="py-2">
      <label className="text-[13px] font-medium text-[var(--foreground)]">{label}</label>
      {description && (
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-[13px] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color Input — named preset or custom hex
// ---------------------------------------------------------------------------

export function ColorInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}) {
  const presets = ["emerald", "red", "amber", "blue", "indigo", "purple", "pink", "cyan"];
  const isCustom = value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl");

  return (
    <div className="py-2">
      <label className="text-[13px] font-medium text-[var(--foreground)]">{label}</label>
      {description && (
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{description}</p>
      )}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-all",
              value === color ? "border-[var(--foreground)] scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
            title={color}
          />
        ))}
        <div className="relative">
          <input
            type="color"
            value={isCustom ? value : "#818CF8"}
            onChange={(e) => onChange(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded-full border-2 border-transparent bg-transparent"
            title="Custom color"
          />
        </div>
      </div>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section divider
// ---------------------------------------------------------------------------

export function ControlSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--card-border)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-[var(--muted)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="px-5 pb-3">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code preview
// ---------------------------------------------------------------------------

export function CodePreview({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[#0A0A0C] p-4">
      <pre className="text-[12px] leading-relaxed">
        <code className="font-[family-name:var(--font-mono)] text-gray-300">
          {code}
        </code>
      </pre>
    </div>
  );
}
