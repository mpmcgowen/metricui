"use client";

import { useState, useRef, useId } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DescriptionPopoverProps {
  content: React.ReactNode;
  className?: string;
  maxWidth?: number;
}

export function DescriptionPopover({ content, className, maxWidth }: DescriptionPopoverProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const popoverId = useId();

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

  return (
    <div
      className={cn("relative inline-flex flex-shrink-0", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
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
      {open && (
        <div
          id={popoverId}
          role="tooltip"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className={cn(
            "absolute left-1/2 top-7 z-[100] -translate-x-1/2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-xs leading-relaxed text-[var(--foreground)] opacity-90 shadow-xl",
            !maxWidth && "w-56",
          )}
          style={maxWidth ? { width: maxWidth } : undefined}
        >
          <div>{content}</div>
        </div>
      )}
    </div>
  );
}
