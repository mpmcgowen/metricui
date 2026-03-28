"use client";

import React from "react";
import { AlertCircle, RefreshCw, Copy, Check, ChevronDown } from "lucide-react";
import { COMPONENT_HINTS } from "@/lib/errorHints";

// ---------------------------------------------------------------------------
// Props & State
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  /** Component name for diagnostics and hint lookup */
  componentName: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  copied: boolean;
  stackOpen: boolean;
}

// ---------------------------------------------------------------------------
// Dev vs Prod detection
// ---------------------------------------------------------------------------

const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------------------
// Error Boundary (must be a class component — React requirement)
// ---------------------------------------------------------------------------

/**
 * Wraps a component export with an error boundary.
 * Catches errors from hooks, memos, and render — the whole component.
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>> {
  // Inner function component avoids React 19 "static flag" error
  // that occurs when forwardRef directly renders a class component child.
  function Inner(props: P & { innerRef?: React.Ref<unknown> }) {
    const { innerRef, ...rest } = props;
    return (
      <ErrorBoundary componentName={componentName}>
        <Component {...(rest as any)} ref={innerRef} />
      </ErrorBoundary>
    );
  }
  Inner.displayName = `${componentName}ErrorBoundary`;

  const Wrapped = React.forwardRef<unknown, P>((props, ref) => (
    <Inner {...(props as any)} innerRef={ref} />
  ));
  Wrapped.displayName = componentName;
  // Preserve grid hint
  (Wrapped as any).__gridHint = (Component as any).__gridHint;
  return Wrapped;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      copied: false,
      stackOpen: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const name = this.props.componentName;
    console.error(
      `[MetricUI] ${name} render error: ${error.message}\n${error.stack ?? ""}${
        errorInfo.componentStack ? `\nComponent stack:${errorInfo.componentStack}` : ""
      }`
    );
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
      copied: false,
      stackOpen: false,
    }));
  };

  handleCopy = async () => {
    const { error } = this.state;
    const { componentName } = this.props;
    if (!error) return;

    const hint = COMPONENT_HINTS[componentName] ?? "";
    const text = [
      `[MetricUI] ${componentName} render error`,
      `Message: ${error.message}`,
      hint ? `Hint: ${hint}` : "",
      `Stack: ${error.stack ?? "N/A"}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // Fallback: select text in a prompt
      window.prompt("Copy this error:", text);
    }
  };

  render() {
    const { hasError, error, retryCount, copied, stackOpen } = this.state;
    const { componentName, children } = this.props;

    // No error — render children, keyed by retryCount to force remount on retry
    if (!hasError) {
      return <React.Fragment key={retryCount}>{children}</React.Fragment>;
    }

    const hint = COMPONENT_HINTS[componentName];
    const errorMessage = error?.message ?? "Unknown error";

    // --- Production: clean, non-technical ---
    if (!isDev) {
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center py-8 text-center"
          data-error={errorMessage}
        >
          <div className="mb-3 text-[var(--muted)] opacity-40">
            <AlertCircle className="h-8 w-8" />
          </div>
          <p className="text-sm text-[var(--muted)]">
            This section couldn&apos;t load
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--card-glow)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      );
    }

    // --- Development: full diagnostics ---
    return (
      <div
        className="flex h-full w-full flex-col gap-3 overflow-auto rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
        data-error={errorMessage}
      >
        {/* Header: component name + buttons */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <span className="rounded bg-red-100 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
              {componentName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={this.handleCopy}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[length:var(--mu-text-2xs)] font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy Error"}
            </button>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[length:var(--mu-text-2xs)] font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        </div>

        {/* Error message */}
        <pre className="whitespace-pre-wrap break-words font-[family-name:var(--font-mono)] text-xs leading-relaxed text-red-700 dark:text-red-300">
          {errorMessage}
        </pre>

        {/* Hint */}
        {hint && (
          <div className="rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2 dark:border-blue-900/40 dark:bg-blue-950/20">
            <p className="text-[length:var(--mu-text-2xs)] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Hint
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-blue-800 dark:text-blue-300">
              {hint}
            </p>
          </div>
        )}

        {/* Stack trace (collapsible) */}
        {error?.stack && (
          <details
            open={stackOpen}
            onToggle={(e) => this.setState({ stackOpen: (e.target as HTMLDetailsElement).open })}
          >
            <summary className="flex cursor-pointer items-center gap-1 text-[length:var(--mu-text-2xs)] font-medium text-red-500 dark:text-red-400">
              <ChevronDown className={`h-3 w-3 transition-transform ${stackOpen ? "rotate-0" : "-rotate-90"}`} />
              Stack Trace
            </summary>
            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words font-[family-name:var(--font-mono)] text-[length:var(--mu-text-2xs)] leading-relaxed text-red-600/70 dark:text-red-400/60">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
