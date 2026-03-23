"use client";

import { useState, useRef, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DescriptionPopoverProps {
  content: React.ReactNode;
  className?: string;
  maxWidth?: number;
}

export function DescriptionPopover({ content, className, maxWidth }: DescriptionPopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Recompute position whenever open state changes
  useEffect(() => {
    if (!open || !triggerRef.current) { setPos(null); return; }
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 });
  }, [open]);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  function handleClick() {
    setOpen((prev) => !prev);
  }

  const tooltip = open && pos && mounted ? createPortal(
    <div
      ref={tooltipRef}
      id={popoverId}
      role="tooltip"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "fixed z-[9999] -translate-x-1/2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-xs leading-relaxed text-[var(--foreground)] shadow-xl",
        !maxWidth && "w-56",
      )}
      style={{
        top: pos.top,
        left: pos.left,
        ...(maxWidth ? { width: maxWidth } : {}),
      }}
    >
      <div>{content}</div>
    </div>,
    document.body,
  ) : null;

  return (
    <div
      className={cn("relative inline-flex flex-shrink-0", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        ref={triggerRef}
        className="-m-2 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        aria-label="More info"
        aria-expanded={open}
        aria-describedby={open ? popoverId : undefined}
        onClick={handleClick}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {tooltip}
    </div>
  );
}
