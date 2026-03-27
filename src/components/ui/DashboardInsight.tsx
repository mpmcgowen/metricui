"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAi, type AiMessage, type AiMetric } from "@/lib/AiContext";
import { Sparkles, Send, X, RotateCcw, Loader2, MessageSquare } from "lucide-react";

// ---------------------------------------------------------------------------
// Quick prompts
// ---------------------------------------------------------------------------

export interface QuickPrompt {
  label: string;
  prompt: string;
}

const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  { label: "What's notable?", prompt: "Analyze this dashboard. What patterns or tensions would I miss by scanning the charts?" },
  { label: "What's at risk?", prompt: "What metrics are showing warning signs? Focus on deteriorating trends and cross-metric tensions." },
  { label: "Summarize", prompt: "Give me a 2-sentence executive summary of this dashboard." },
];

// ---------------------------------------------------------------------------
// Markdown renderer
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): ReactNode[] {
  return text.split(/\n\n+/).map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    // Headings
    const h3Match = trimmed.match(/^###\s+(.+)$/);
    if (h3Match) return <p key={bi} className={cn("text-[13px] font-semibold text-[var(--foreground)]", bi > 0 && "mt-4")}>{renderInline(h3Match[1])}</p>;
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) return <p key={bi} className={cn("text-[14px] font-bold text-[var(--foreground)]", bi > 0 && "mt-4")}>{renderInline(h2Match[1])}</p>;

    const lines = trimmed.split("\n");
    // Numbered lists
    if (lines.every((l) => /^\d+[.)]\s/.test(l.trim()))) {
      return (
        <ol key={bi} className={cn("space-y-1 list-decimal list-inside", bi > 0 && "mt-3")}>
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.replace(/^\d+[.)]\s/, ""))}</li>
          ))}
        </ol>
      );
    }
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
    return <p key={bi} className={bi > 0 ? "mt-3" : ""}>{renderInline(trimmed)}</p>;
  });
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\[\[(.+?)\]\]|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) {
      parts.push(
        <span key={match.index} className="inline-flex items-center gap-0.5 rounded-md bg-[var(--accent)]/10 px-1.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
          <Sparkles className="h-2 w-2" />{match[2]}
        </span>
      );
    } else if (match[3]) {
      parts.push(<strong key={match.index} className="font-semibold text-[var(--foreground)]">{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<code key={match.index} className="rounded bg-[var(--card-border)]/50 px-1 py-0.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)]">{match[5]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

// ---------------------------------------------------------------------------
// Message components
// ---------------------------------------------------------------------------

function AssistantMessage({ message }: { message: AiMessage }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10">
        <Sparkles className="h-3 w-3 text-[var(--accent)]" />
      </div>
      <div className="min-w-0 flex-1 text-[13px] leading-[1.65] text-[var(--foreground)]/85">
        {renderMarkdown(message.content)}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: AiMessage }) {
  // Render @mentions as badges
  const parts: ReactNode[] = [];
  const mentionRegex = /@([^@]+?)(?=\s@|\s|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const text = message.content;
  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const mentionText = match[1].replace(/[\s.!?,;:]+$/, "");
    parts.push(
      <span key={match.index} className="inline-flex items-center gap-0.5 rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-semibold">
        <Sparkles className="h-2 w-2" />{mentionText}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[var(--accent)] px-3.5 py-2 text-[13px] leading-relaxed text-white">
        {parts.length > 0 ? parts : text}
      </div>
    </div>
  );
}

function StreamingMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10">
        <Sparkles className="h-3 w-3 animate-pulse text-[var(--accent)]" />
      </div>
      <div className="min-w-0 flex-1 text-[13px] leading-[1.65] text-[var(--foreground)]/85">
        {text ? (
          <>{renderMarkdown(text)}<span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse bg-[var(--accent)] align-text-bottom" /></>
        ) : (
          <span className="flex items-center gap-2 text-[var(--muted)]">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[12px]">Analyzing your data...</span>
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// @ Mention dropdown
// ---------------------------------------------------------------------------

function MentionDropdown({ query, metrics, onSelect, selectedIndex, position }: {
  query: string;
  metrics: AiMetric[];
  onSelect: (title: string) => void;
  selectedIndex: number;
  position: { bottom: number; left: number };
}) {
  const filtered = metrics.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return createPortal(
    <div
      className="fixed z-[10001] max-h-56 w-72 overflow-y-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] py-1 shadow-xl"
      style={{ bottom: position.bottom, left: position.left }}
    >
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        Components on this tab
      </div>
      {filtered.map((m, i) => (
        <button
          key={m.title}
          onClick={() => onSelect(m.title)}
          ref={(el) => { if (i === selectedIndex && el) el.scrollIntoView({ block: "nearest" }); }}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors",
            i === selectedIndex ? "bg-[var(--accent)]/10" : "hover:bg-[var(--card-glow)]",
          )}
        >
          <span className="font-medium text-[var(--accent)]">{m.title}</span>
          <span className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">{m.component}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DashboardInsightProps {
  quickPrompts?: QuickPrompt[] | false;
  placeholder?: string;
  /** Position of the floating button. Default: "bottom-right" */
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardInsight({
  quickPrompts = DEFAULT_QUICK_PROMPTS,
  placeholder = "Ask about your data...",
  position = "bottom-right",
  className,
}: DashboardInsightProps) {
  const ai = useAi();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionPos, setMentionPos] = useState({ bottom: 0, left: 0 });
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  // Register openWith handler so CardShell sparkle icons can open chat pre-scoped
  useEffect(() => {
    if (!ai) return;
    ai.registerOpenHandler((title: string) => {
      setSelectedMentions((prev) => prev.includes(title) ? prev : [...prev, title]);
      setOpen(true);
    });
  }, [ai]);

  // Animate in/out
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setVisible(false);
    }
  }, [open]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [ai?.messages, ai?.streamingText]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!ai?.enabled || !mounted) return null;

  const hasMessages = ai.messages.length > 0;

  // Get registered metrics for @ mentions
  const metrics = Array.from(ai.getMetrics().values());

  const handleSend = async () => {
    const text = input.trim();
    if (!text && selectedMentions.length === 0) return;
    if (ai.isLoading) return;

    // Build the full message with mentions prefixed
    const mentionPrefix = selectedMentions.map((m) => `@${m}`).join(" ");
    const fullText = mentionPrefix ? `${mentionPrefix} ${text}` : text;

    setInput("");
    setMentionQuery(null);
    setSelectedMentions([]);

    const triggerContext = selectedMentions.length > 0 ? selectedMentions.join(", ") : undefined;
    await ai.send(fullText, triggerContext);
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    // Detect @ mention
    const lastAt = value.lastIndexOf("@");
    if (lastAt >= 0) {
      const afterAt = value.slice(lastAt + 1);
      if (!afterAt.includes(" ") || afterAt.length < 20) {
        setMentionQuery(afterAt);
        setMentionIndex(0);
        // Position dropdown above input
        const inputEl = inputRef.current;
        if (inputEl) {
          const rect = inputEl.getBoundingClientRect();
          setMentionPos({ bottom: window.innerHeight - rect.top + 8, left: rect.left });
        }
        return;
      }
    }
    setMentionQuery(null);
  };

  const handleMentionSelect = (title: string) => {
    const lastAt = input.lastIndexOf("@");
    const before = input.slice(0, lastAt);
    setInput(before.trim() ? before.trim() + " " : "");
    setSelectedMentions((prev) => prev.includes(title) ? prev : [...prev, title]);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (ai.isLoading) return;
    await ai.send(prompt);
  };

  // Floating button
  const button = (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        "fixed z-[9998] flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:shadow-xl hover:shadow-[var(--accent)]/30 hover:scale-105",
        position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6",
        open && "scale-0 opacity-0",
        className,
      )}
    >
      <Sparkles className="h-4 w-4" />
      <span className="text-sm font-medium">AI Insights</span>
      {hasMessages && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] font-bold">
          {ai.messages.filter((m) => m.role === "assistant").length}
        </span>
      )}
    </button>
  );

  // Sidebar panel
  const sidebar = open && createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className={cn(
        "absolute top-0 bottom-0 flex w-full max-w-md flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out",
        position === "bottom-right" ? "right-0" : "left-0",
        visible
          ? "translate-x-0"
          : position === "bottom-right" ? "translate-x-full" : "-translate-x-full",
      )}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[var(--card-border)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)]">AI Insights</span>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--foreground)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Ask questions about your dashboard. Use <span className="font-medium text-[var(--accent)]">@</span> to reference specific charts.
          </p>
        </div>

        {/* Quick prompts — show when no messages */}
        {!hasMessages && !ai.isLoading && quickPrompts && (
          <div className="flex-shrink-0 border-b border-[var(--card-border)] px-5 py-3">
            <div className="flex flex-wrap gap-2">
              {(quickPrompts as QuickPrompt[]).map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)] transition-all hover:border-[var(--accent)]/40 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={chatRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {ai.messages.map((msg, i) =>
            msg.role === "user"
              ? <UserMessage key={i} message={msg} />
              : <AssistantMessage key={i} message={msg} />
          )}
          {ai.isLoading && <StreamingMessage text={ai.streamingText} />}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-[var(--card-border)] px-5 py-3">
          {/* Mention chips */}
          {selectedMentions.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {selectedMentions.map((m) => (
                <span key={m} className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                  <Sparkles className="h-2 w-2" />
                  {m}
                  <button
                    onClick={() => setSelectedMentions((prev) => prev.filter((p) => p !== m))}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--accent)]/20"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (mentionQuery !== null) {
                  const filtered = metrics.filter((m) => m.title.toLowerCase().includes(mentionQuery.toLowerCase()));
                  if (e.key === "ArrowDown") { e.preventDefault(); setMentionIndex((i) => Math.min(i + 1, filtered.length - 1)); return; }
                  if (e.key === "ArrowUp") { e.preventDefault(); setMentionIndex((i) => Math.max(i - 1, 0)); return; }
                  if (e.key === "Enter" && filtered[mentionIndex]) { e.preventDefault(); handleMentionSelect(filtered[mentionIndex].title); return; }
                  if (e.key === "Escape") { e.preventDefault(); setMentionQuery(null); return; }
                }
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                if (e.key === "Escape") { setOpen(false); }
              }}
              placeholder={placeholder}
              disabled={ai.isLoading}
              className="flex-1 bg-transparent text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none disabled:opacity-50"
            />
            {ai.isLoading ? (
              <button onClick={ai.abort} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                {hasMessages && (
                  <button
                    onClick={ai.clear}
                    className="rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "rounded-lg p-1.5 transition-all",
                    input.trim() ? "text-[var(--accent)] hover:bg-[var(--accent)]/10" : "text-[var(--muted)]/20",
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* @ Mention dropdown */}
      {mentionQuery !== null && (
        <MentionDropdown
          query={mentionQuery}
          metrics={metrics}
          onSelect={handleMentionSelect}
          selectedIndex={mentionIndex}
          position={mentionPos}
        />
      )}
    </div>,
    document.body,
  );

  return (
    <>
      {button}
      {sidebar}
    </>
  );
}
