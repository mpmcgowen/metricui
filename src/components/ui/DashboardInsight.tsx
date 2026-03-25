"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAi, type AiMessage } from "@/lib/AiContext";
import { Sparkles, Send, X, RotateCcw, Loader2, MessageSquare, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Quick prompts — pre-built analysis buttons
// ---------------------------------------------------------------------------

export interface QuickPrompt {
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  { label: "What's notable?", prompt: "Analyze this dashboard. What patterns or tensions in the data would I miss by scanning the charts?" },
  { label: "What's at risk?", prompt: "What metrics on this dashboard are showing warning signs? Focus on deteriorating trends and cross-metric tensions." },
  { label: "Summarize", prompt: "Give me a 2-sentence executive summary of this dashboard's current state." },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DashboardInsightProps {
  /** Custom quick prompts. Pass false to hide. Default: 3 built-in prompts. */
  quickPrompts?: QuickPrompt[] | false;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Title shown above the chat */
  title?: string;
  /** Start collapsed. Default: false */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Collapse change handler */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Additional class */
  className?: string;
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: AiMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "bg-[var(--accent)] text-white"
            : "bg-[var(--card-glow)] text-[var(--foreground)]",
        )}
      >
        {message.content.split("\n\n").map((para, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streaming indicator
// ---------------------------------------------------------------------------

function StreamingBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-xl bg-[var(--card-glow)] px-4 py-2.5 text-[13px] leading-relaxed text-[var(--foreground)]">
        {text ? (
          text.split("\n\n").map((para, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>
              {para}
            </p>
          ))
        ) : (
          <span className="flex items-center gap-2 text-[var(--muted)]">
            <Loader2 className="h-3 w-3 animate-spin" />
            Analyzing...
          </span>
        )}
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--accent)]" />
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const collapsed = collapsedProp ?? internalCollapsed;
  const setCollapsed = useCallback((v: boolean) => {
    setInternalCollapsed(v);
    onCollapseChange?.(v);
  }, [onCollapseChange]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ai?.messages, ai?.streamingText]);

  // Focus input when expanded
  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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
    <div
      className={cn(
        "noise-texture overflow-hidden rounded-[var(--mu-card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm transition-all",
        className,
      )}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[var(--card-glow)]"
      >
        <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
        <span className="flex-1 text-xs font-semibold text-[var(--foreground)]">
          {title}
        </span>
        {hasMessages && (
          <span className="rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-semibold text-[var(--accent)]">
            {ai.messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 text-[var(--muted)] transition-transform",
            !collapsed && "rotate-180",
          )}
        />
      </button>

      {/* Body */}
      {!collapsed && (
        <div className="border-t border-[var(--card-border)]">
          {/* Quick prompts — show when no messages */}
          {!hasMessages && quickPrompts && quickPrompts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 py-3">
              {(quickPrompts as QuickPrompt[]).map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  disabled={ai.isLoading}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border border-[var(--card-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)] transition-all",
                    "hover:border-[var(--accent)]/30 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
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
            <div className="max-h-[400px] space-y-3 overflow-y-auto px-4 py-3">
              {ai.messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {ai.isLoading && (
                <StreamingBubble text={ai.streamingText} />
              )}
              <div ref={messagesEndRef} />
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
                "flex-1 bg-transparent text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)]/50 outline-none",
                "disabled:opacity-50",
              )}
            />
            {ai.isLoading ? (
              <button
                onClick={ai.abort}
                className="rounded-md p-1.5 text-[var(--muted)] transition-colors hover:text-red-500"
                aria-label="Stop"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                {hasMessages && (
                  <button
                    onClick={ai.clear}
                    className="rounded-md p-1.5 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    aria-label="Clear chat"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    input.trim()
                      ? "text-[var(--accent)] hover:bg-[var(--accent)]/10"
                      : "text-[var(--muted)]/30 cursor-not-allowed",
                  )}
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
