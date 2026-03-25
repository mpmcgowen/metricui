"use client";

import { useState, useRef, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAi, type AiMessage } from "@/lib/AiContext";
import { Sparkles, Send, X, RotateCcw, Loader2, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Quick prompts
// ---------------------------------------------------------------------------

export interface QuickPrompt {
  label: string;
  prompt: string;
  icon?: ReactNode;
}

const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  { label: "What's notable?", prompt: "Analyze this dashboard. What patterns or tensions in the data would I miss by scanning the charts?" },
  { label: "What's at risk?", prompt: "What metrics on this dashboard are showing warning signs? Focus on deteriorating trends and cross-metric tensions." },
  { label: "Summarize", prompt: "Give me a 2-sentence executive summary of this dashboard's current state." },
];

// ---------------------------------------------------------------------------
// Simple markdown renderer — handles **bold**, *italic*, \n\n paragraphs,
// - bullet lists, and `inline code`. No library needed.
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): ReactNode[] {
  const blocks = text.split(/\n\n+/);

  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Bullet list
    const lines = trimmed.split("\n");
    if (lines.every((l) => /^[-•*]\s/.test(l.trim()))) {
      return (
        <ul key={bi} className={cn("space-y-1", bi > 0 && "mt-3")}>
          {lines.map((line, li) => (
            <li key={li} className="flex gap-2">
              <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--accent)]/60" />
              <span>{renderInline(line.replace(/^[-•*]\s/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Paragraph
    return (
      <p key={bi} className={bi > 0 ? "mt-3" : ""}>
        {renderInline(trimmed)}
      </p>
    );
  });
}

/** Capture a component as PNG and return as data URL */
async function captureComponent(title: string): Promise<string | null> {
  const el = document.querySelector(`[data-ai-title="${title}"]`) as HTMLElement | null;
  if (!el) return null;
  try {
    const { domToBlob } = await import("modern-screenshot");
    const blob = await domToBlob(el, { scale: 2 });
    if (!blob) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/** Citation overlay state — shared between chips and the overlay */
interface CitationOverlay {
  title: string;
  mode: "modal" | "sidebar";
  imageUrl: string | null;
  metricData: Record<string, unknown> | null;
  componentType: string | null;
}

const CitationContext = createContext<{
  open: (title: string, mode: "modal" | "sidebar") => void;
  close: () => void;
  overlay: CitationOverlay | null;
} | null>(null);

function CitationProvider({ children }: { children: ReactNode }) {
  const ai = useAi();
  const [overlay, setOverlay] = useState<CitationOverlay | null>(null);

  const open = useCallback(async (title: string, mode: "modal" | "sidebar") => {
    // Get metric data from AI context
    let metricData: Record<string, unknown> | null = null;
    let componentType: string | null = null;
    if (ai) {
      const metrics = ai.getMetrics();
      for (const [, m] of metrics) {
        if (m.title === title) {
          metricData = m.data;
          componentType = m.component;
          break;
        }
      }
    }

    // Show overlay immediately with data
    setOverlay({ title, mode, imageUrl: null, metricData, componentType });

    // Try to capture image (may need tab switch)
    let imageUrl = await captureComponent(title);

    if (!imageUrl && ai) {
      // Switch tabs to find and capture
      const navEl = document.querySelector("[data-dashboard-tabs]");
      const allTabs = navEl?.getAttribute("data-dashboard-tabs")?.split(",") ?? [];
      for (const t of allTabs) {
        ai.navigateToTab(t);
        await new Promise((r) => setTimeout(r, 200));
        imageUrl = await captureComponent(title);
        if (imageUrl) break;
      }
    }

    if (imageUrl) {
      setOverlay((prev) => prev ? { ...prev, imageUrl } : null);
    }
  }, [ai]);

  const close = useCallback(() => {
    if (overlay?.imageUrl) URL.revokeObjectURL(overlay.imageUrl);
    setOverlay(null);
  }, [overlay]);

  return (
    <CitationContext.Provider value={{ open, close, overlay }}>
      {children}
    </CitationContext.Provider>
  );
}

/** Citation chip — opens modal or sidebar */
function CitationChip({ title }: { title: string }) {
  const ctx = useContext(CitationContext);

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        onClick={() => ctx?.open(title, "sidebar")}
        className="inline-flex items-center gap-0.5 rounded-md bg-[var(--accent)]/10 px-1.5 py-0.5 text-[11px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20 cursor-pointer"
      >
        <Sparkles className="h-2 w-2" />
        {title}
      </button>
    </span>
  );
}

/** Citation overlay — modal or sidebar showing the referenced component */
function CitationOverlayPanel() {
  const ctx = useContext(CitationContext);
  const ai = useAi();
  const [followUp, setFollowUp] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (ctx?.overlay) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
    }
  }, [ctx?.overlay]);

  if (!ctx?.overlay) return null;

  const { title, mode, imageUrl, metricData, componentType } = ctx.overlay;

  const handleFollowUp = async () => {
    const text = followUp.trim();
    if (!text || !ai) return;
    setFollowUp("");
    await ai.send(text, `Regarding [[${title}]] (${componentType})`);
    ctx.close();
  };

  if (mode === "modal") {
    return createPortal(
      <div className="fixed inset-0 z-[9999]">
        <div
          className={cn("absolute inset-0 bg-black/50 transition-opacity duration-200", visible ? "opacity-100" : "opacity-0")}
          onClick={ctx.close}
        />
        <div className={cn(
          "absolute left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl transition-all duration-200",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--foreground)]">{title}</span>
              {componentType && (
                <span className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">{componentType}</span>
              )}
            </div>
            <button onClick={ctx.close} className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--foreground)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Image */}
          {imageUrl ? (
            <div className="p-4">
              <img src={imageUrl} alt={title} className="w-full rounded-lg border border-[var(--card-border)]" />
            </div>
          ) : metricData ? (
            <div className="p-4 text-sm text-[var(--muted)]">
              {Object.entries(metricData).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-[var(--card-border)] last:border-0">
                  <span className="font-medium text-[var(--foreground)]">{k}</span>
                  <span className="font-[family-name:var(--font-mono)]">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-sm text-[var(--muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Capturing...
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  }

  // Sidebar mode
  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
        onClick={ctx.close}
      />
      <div className={cn(
        "absolute right-0 top-0 bottom-0 flex w-full max-w-lg flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out",
        visible ? "translate-x-0" : "translate-x-full",
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--foreground)]">{title}</span>
            </div>
            {componentType && (
              <span className="mt-0.5 text-[11px] text-[var(--muted)]">{componentType}</span>
            )}
          </div>
          <button onClick={ctx.close} className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--foreground)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Component capture */}
        <div className="border-b border-[var(--card-border)] p-4">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full rounded-lg border border-[var(--card-border)]" />
          ) : metricData ? (
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-sm">
              {Object.entries(metricData).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-[var(--card-border)]/50 last:border-0">
                  <span className="font-medium text-[var(--foreground)]">{k}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-[var(--muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Capturing component...
            </div>
          )}
        </div>

        {/* AI chat — scoped to this component */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-[12px] text-[var(--muted)]">
              Ask a follow-up question about <strong className="text-[var(--foreground)]">{title}</strong>
            </p>
            {ai?.messages.filter((m) => m.triggerContext?.includes(title)).map((msg, i) =>
              msg.role === "user"
                ? <div key={i} className="mt-3"><UserMessage message={msg} /></div>
                : <div key={i} className="mt-3"><AssistantMessage message={msg} /></div>
            )}
            {ai?.isLoading && ai.streamingText && (
              <div className="mt-3"><StreamingMessage text={ai.streamingText} /></div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--card-border)] px-4 py-3">
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleFollowUp(); } }}
              placeholder={`Ask about ${title}...`}
              className="flex-1 bg-transparent text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none"
            />
            <button
              onClick={handleFollowUp}
              disabled={!followUp.trim()}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                followUp.trim() ? "text-[var(--accent)] hover:bg-[var(--accent)]/10" : "text-[var(--muted)]/20",
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Render inline formatting: **bold**, *italic*, `code`, [[citation]] */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Match [[citation]], **bold**, *italic*, `code`
  const regex = /(\[\[(.+?)\]\]|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // [[citation]]
      const citTitle = match[2];
      parts.push(
        <CitationChip key={match.index} title={citTitle} />
      );
    } else if (match[3]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold text-[var(--foreground)]">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      // *italic*
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="rounded bg-[var(--card-border)]/50 px-1 py-0.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)]"
        >
          {match[5]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DashboardInsightProps {
  quickPrompts?: QuickPrompt[] | false;
  placeholder?: string;
  title?: string;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function AssistantMessage({ message }: { message: AiMessage }) {
  return (
    <div className="group">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
        </div>
        <div className="min-w-0 flex-1 text-[13px] leading-[1.65] text-[var(--foreground)]/85">
          {renderMarkdown(message.content)}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: AiMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[var(--accent)] px-3.5 py-2 text-[13px] leading-relaxed text-white">
        {message.content}
      </div>
    </div>
  );
}

function StreamingMessage({ text }: { text: string }) {
  return (
    <div className="group">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10">
          <Sparkles className="h-3 w-3 animate-pulse text-[var(--accent)]" />
        </div>
        <div className="min-w-0 flex-1 text-[13px] leading-[1.65] text-[var(--foreground)]/85">
          {text ? (
            <>
              {renderMarkdown(text)}
              <span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse bg-[var(--accent)] align-text-bottom" />
            </>
          ) : (
            <span className="flex items-center gap-2 text-[var(--muted)]">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-[12px]">Analyzing your data...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardInsight({
  quickPrompts = DEFAULT_QUICK_PROMPTS,
  placeholder = "Ask about your data...",
  title = "AI Insights",
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapseChange,
  className,
}: DashboardInsightProps) {
  const ai = useAi();
  const [input, setInput] = useState("");
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const collapsed = collapsedProp ?? internalCollapsed;
  const setCollapsed = useCallback((v: boolean) => {
    setInternalCollapsed(v);
    onCollapseChange?.(v);
  }, [onCollapseChange]);

  // Auto-scroll chat container
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ai?.messages, ai?.streamingText]);

  // Focus input on expand
  useEffect(() => {
    if (!collapsed) setTimeout(() => inputRef.current?.focus(), 100);
  }, [collapsed]);

  if (!ai?.enabled) return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || ai.isLoading) return;
    setInput("");
    await ai.send(text);
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (ai.isLoading) return;
    if (collapsed) setCollapsed(false);
    await ai.send(prompt);
  };

  const hasMessages = ai.messages.length > 0;

  return (
    <CitationProvider>
    <div
      className={cn(
        "noise-texture overflow-hidden rounded-[var(--mu-card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] transition-all",
        className,
      )}
    >
      {/* ── Header ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCollapsed(!collapsed); } }}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-[var(--card-glow)]"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--accent)]/10">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
        </div>
        <span className="flex-1 text-xs font-semibold tracking-wide text-[var(--foreground)]">
          {title}
        </span>
        {hasMessages && (
          <span className="rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-bold text-[var(--accent)]">
            {ai.messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-200",
            !collapsed && "rotate-180",
          )}
        />
      </div>

      {/* ── Body ── */}
      {!collapsed && (
        <div className="border-t border-[var(--card-border)]">
          {/* Quick prompts */}
          {!hasMessages && !ai.isLoading && quickPrompts && (quickPrompts as QuickPrompt[]).length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-3">
              {(quickPrompts as QuickPrompt[]).map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-3 py-1.5",
                    "text-[11px] font-medium text-[var(--muted)] transition-all duration-200",
                    "hover:border-[var(--accent)]/40 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 hover:shadow-sm",
                  )}
                >
                  {qp.icon ?? <Sparkles className="h-2.5 w-2.5" />}
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {(hasMessages || ai.isLoading) && (
            <div
              ref={chatContainerRef}
              className="max-h-[500px] space-y-4 overflow-y-auto px-4 py-4"
            >
              {ai.messages.map((msg, i) =>
                msg.role === "user"
                  ? <UserMessage key={i} message={msg} />
                  : <AssistantMessage key={i} message={msg} />
              )}
              {ai.isLoading && <StreamingMessage text={ai.streamingText} />}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-[var(--card-border)] px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={placeholder}
              disabled={ai.isLoading}
              className={cn(
                "flex-1 bg-transparent text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none",
                "disabled:opacity-50",
              )}
            />
            {ai.isLoading ? (
              <button
                onClick={ai.abort}
                className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                aria-label="Stop generating"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                {hasMessages && (
                  <button
                    onClick={ai.clear}
                    className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]"
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "rounded-lg p-1.5 transition-all duration-200",
                    input.trim()
                      ? "text-[var(--accent)] hover:bg-[var(--accent)]/10"
                      : "text-[var(--muted)]/20 cursor-not-allowed",
                  )}
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    <CitationOverlayPanel />
    </CitationProvider>
  );
}
