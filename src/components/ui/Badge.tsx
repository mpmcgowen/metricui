"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: React.ReactNode;
  size?: BadgeSize;
  /** Custom color — sets text and tinted background via inline style */
  color?: string;
  onDismiss?: () => void;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--mu-neutral-bg)] text-[var(--mu-neutral-text)]",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger:
    "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info:
    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  outline:
    "bg-transparent border border-current",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--mu-neutral-dot)]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  outline: "bg-current",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    variant = "default",
    dot = false,
    icon,
    size = "md",
    color,
    onDismiss,
    className,
    id,
    "data-testid": dataTestId,
  },
  ref,
) {
  const colorStyle: React.CSSProperties | undefined = color
    ? {
        color,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        borderColor: variant === "outline" ? color : undefined,
      }
    : undefined;

  return (
    <span
      ref={ref}
      id={id}
      data-testid={dataTestId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        sizeStyles[size],
        !color && variantStyles[variant],
        className,
      )}
      style={colorStyle}
    >
      {icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : dot ? (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", !color && dotStyles[variant])}
          style={color ? { backgroundColor: color } : undefined}
        />
      ) : null}
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-mr-1 ml-0.5 inline-flex flex-shrink-0 items-center justify-center rounded-full p-1.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
});
