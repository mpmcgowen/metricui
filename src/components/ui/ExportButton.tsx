"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Download, Image, FileSpreadsheet, Clipboard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  captureElementAsPng,
  generateCsv,
  downloadFile,
  copyToClipboard,
  copyImageToClipboard,
  exportFilename,
  buildFilterMetadata,
} from "@/lib/export";
import type { DataRow } from "@/lib/types";
import { useMetricFilters } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";

interface ExportButtonProps {
  /** Title for the filename */
  title?: string;
  /** The element to capture for PNG export */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Raw data for CSV export. If not provided, CSV option is hidden. */
  data?: DataRow[];
  /** Column definitions for CSV export */
  columns?: { key: string; header?: string }[];
  /** Formatted value for clipboard copy (KPI cards) */
  copyValue?: string;
  /** Size */
  dense?: boolean;
  className?: string;
}

export function ExportButton({
  title = "Chart",
  targetRef,
  data,
  columns,
  copyValue,
  dense,
  className,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  const filters = useMetricFilters();
  const cf = useCrossFilter();

  // Position dropdown and close on outside click
  useEffect(() => {
    if (!open) return;
    if (triggerBtnRef.current) {
      const rect = triggerBtnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.right });
    }
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          triggerBtnRef.current && !triggerBtnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Build filter string for filenames and metadata
  const filterString = buildFilterMetadata(
    filters ? { period: filters.period, dimensions: filters.dimensions } : undefined,
    cf?.selection ?? null,
  );

  const filterLabel = (() => {
    const parts: string[] = [];
    if (filters?.dimensions) {
      for (const [, values] of Object.entries(filters.dimensions)) {
        if (values.length > 0) parts.push(values.join(", "));
      }
    }
    if (cf?.selection) parts.push(String(cf.selection.value));
    return parts.length > 0 ? parts.join(", ") : undefined;
  })();

  const handleImage = useCallback(async () => {
    if (!targetRef.current) return;
    setOpen(false);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const blob = await captureElementAsPng(targetRef.current);
      downloadFile(blob, exportFilename(title, "png", filterLabel));
    } catch (err) {
      console.error("Image export failed:", err);
    }
  }, [targetRef, title, filterLabel]);

  const handleCsv = useCallback(() => {
    if (!data) return;
    const csv = generateCsv(data, columns, filterString);
    downloadFile(csv, exportFilename(title, "csv", filterLabel), "text/csv;charset=utf-8");
    setOpen(false);
  }, [data, columns, title, filterLabel, filterString]);

  const handleCopy = useCallback(async () => {
    setOpen(false);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (copyValue) {
      await copyToClipboard(copyValue);
    } else if (targetRef.current) {
      try {
        const blob = await captureElementAsPng(targetRef.current);
        await copyImageToClipboard(blob);
      } catch {
        // Fallback: copy data as text
        if (data) {
          const csv = generateCsv(data, columns);
          await copyToClipboard(csv);
        }
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }, [copyValue, targetRef, data, columns]);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        ref={triggerBtnRef}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={cn(
          "rounded-md p-1 text-[var(--muted)] opacity-0 transition-all",
          "group-hover:opacity-60 hover:!opacity-100 hover:text-[var(--foreground)]",
          "focus:opacity-100",
          dense ? "p-0.5" : "p-1",
        )}
        aria-label="Export"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Download className="h-3 w-3" />}
      </button>

      {open && mounted && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[var(--mu-z-modal)] min-w-[160px] rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-1 shadow-xl"
          style={{ top: pos.top, left: pos.left, transform: "translateX(-100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleImage}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]"
          >
            <Image className="h-3 w-3" />
            Save as image
          </button>
          {data && (
            <button
              onClick={handleCsv}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]"
            >
              <FileSpreadsheet className="h-3 w-3" />
              Download CSV
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]"
          >
            <Clipboard className="h-3 w-3" />
            {copyValue ? "Copy value" : "Copy to clipboard"}
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
