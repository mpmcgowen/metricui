"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single metric registered by a dashboard component */
export interface AiMetric {
  /** Component type (e.g., "KpiCard", "BarChart") */
  component: string;
  /** Title of the component */
  title: string;
  /** Key-value data summary */
  data: Record<string, unknown>;
  /** Which tab this component lives on (if using DashboardNav) */
  tab?: string;
  /** Dev-provided context about this specific component */
  aiContext?: string;
  /** Render function that returns the interactive component content */
  render?: () => ReactNode;
  /** Height hint for chart containers */
  height?: number;
}

/** A chat message */
export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  /** Timestamp */
  timestamp: number;
  /** Which card triggered this message (if opened from a card) */
  triggerContext?: string;
}

/** The function the dev provides to call their LLM */
export type AiAnalyzeFn = (
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  options?: { signal?: AbortSignal },
) => Promise<string> | AsyncIterable<string>;

/** Configuration passed to Dashboard's `ai` prop */
export interface AiConfig {
  /** The LLM function — dev brings their own */
  analyze: AiAnalyzeFn;
  /** Enable token streaming. Default: true */
  stream?: boolean;
  /** Company-level context — who you are, your industry, stage, ICP. Included in every prompt. */
  company?: string;
  /** Dashboard-level context — what this dashboard measures, targets, recent changes. */
  context?: string;
  /** Full system prompt override */
  systemPrompt?: string;
  /** Tone preset */
  tone?: "executive" | "technical" | "narrative";
  /** Callback when a message is added (for persistence) */
  onMessage?: (message: AiMessage) => void;
  /** Controlled message history (for persistence) */
  messages?: AiMessage[];
}

/** Internal context value */
export interface AiContextValue {
  /** Whether AI is configured */
  enabled: boolean;
  /** The AI config */
  config: AiConfig | null;
  /** Register a metric from a component */
  registerMetric: (id: string, metric: AiMetric) => void;
  /** Unregister a metric */
  unregisterMetric: (id: string) => void;
  /** Get all registered metrics */
  getMetrics: () => Map<string, AiMetric>;
  /** Register a tab navigation function (called by DashboardNav) */
  registerTabNavigator: (fn: (tab: string) => void) => void;
  /** Navigate to a tab (used by citation clicks) */
  navigateToTab: (tab: string) => void;
  /** Find which tab a metric title lives on */
  findTab: (title: string) => string | undefined;
  /** Chat messages */
  messages: AiMessage[];
  /** Send a user message and get AI response */
  send: (content: string, triggerContext?: string) => Promise<void>;
  /** Clear chat history */
  clear: () => void;
  /** Whether the AI is currently responding */
  isLoading: boolean;
  /** Current streaming text (partial response) */
  streamingText: string;
  /** Abort current request */
  abort: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AiCtx = createContext<AiContextValue | null>(null);

export function useAi(): AiContextValue | null {
  return useContext(AiCtx);
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

const TONE_INSTRUCTIONS = {
  executive: "Write for a VP or C-level reader. Lead with business impact. One paragraph max per insight.",
  technical: "Be precise with numbers. Include percentages, ratios, and deltas. Use data analyst language.",
  narrative: "Tell a story with the data. Connect insights into a coherent narrative about what's happening.",
};

const BASE_SYSTEM_PROMPT = `You are a senior data analyst reviewing a live dashboard. Your job is to find what the human would MISS by scanning the charts themselves.

RULES:
1. NEVER restate numbers already visible on the dashboard. The user can see them.
2. Focus on TENSIONS between metrics — when two things should move together but don't.
3. Surface HIDDEN PATTERNS — things buried in aggregations, ratios between dimensions, trailing trends.
4. Be SPECIFIC — cite exact numbers, name exact dimensions. Vague observations are worthless.
5. Be CONCISE — 2-3 insights max unless asked for more.
6. NEVER give generic advice like "consider improving" or "you should investigate." State what the data shows.
7. When the user asks a question, answer it using the dashboard data. Follow the thread — connect the asked metric to related metrics.
8. CITE YOUR SOURCES using [[Component Title]] syntax. Every claim must reference which dashboard component(s) it draws from. Example: "Email converts at 7.1% [[Traffic Sources]] despite only 8% of sessions [[Sessions]]". Use the exact component titles provided in DASHBOARD COMPONENTS below.`;

function buildSystemPrompt(config: AiConfig, metrics: Map<string, AiMetric>, filterContext?: string): string {
  if (config.systemPrompt) return config.systemPrompt;

  const parts: string[] = [BASE_SYSTEM_PROMPT];

  if (config.tone && TONE_INSTRUCTIONS[config.tone]) {
    parts.push(`\nTONE: ${TONE_INSTRUCTIONS[config.tone]}`);
  }

  // Three-level context hierarchy: company → dashboard → component
  if (config.company) {
    parts.push(`\nCOMPANY: ${config.company}`);
  }

  if (config.context) {
    parts.push(`\nDASHBOARD CONTEXT: ${config.context}`);
  }

  if (filterContext) {
    parts.push(`\nACTIVE FILTERS: ${filterContext}`);
  }

  // Build dashboard data context from registered metrics — these are citable sources
  if (metrics.size > 0) {
    parts.push("\nDASHBOARD COMPONENTS (cite using [[Title]]):");
    for (const [, metric] of metrics) {
      const dataStr = Object.entries(metric.data)
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join(", ");
      let line = `- [[${metric.title}]] (${metric.component}): ${dataStr}`;
      if (metric.aiContext) {
        line += `\n  CONTEXT: ${metric.aiContext}`;
      }
      parts.push(line);
    }
  }

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AiProviderProps {
  config: AiConfig | null;
  filterContext?: string;
  children: ReactNode;
}

export function AiProvider({ config, filterContext, children }: AiProviderProps) {
  const metricsRef = useRef(new Map<string, AiMetric>());
  const tabNavigatorRef = useRef<((tab: string) => void) | null>(null);
  const waitersRef = useRef(new Map<string, (metric: AiMetric) => void>());
  const [internalMessages, setInternalMessages] = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  // Controlled vs uncontrolled messages
  const messages = config?.messages ?? internalMessages;
  const setMessages = config?.messages
    ? () => {} // controlled — dev manages state via onMessage
    : setInternalMessages;

  const registerMetric = useCallback((id: string, metric: AiMetric) => {
    metricsRef.current.set(id, metric);
    // Resolve any waiters looking for this metric by title
    const waiter = waitersRef.current.get(metric.title);
    if (waiter) {
      waitersRef.current.delete(metric.title);
      waiter(metric);
    }
  }, []);

  const unregisterMetric = useCallback((id: string) => {
    metricsRef.current.delete(id);
  }, []);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const registerTabNavigator = useCallback((fn: (tab: string) => void) => {
    tabNavigatorRef.current = fn;
  }, []);

  const navigateToTab = useCallback((tab: string) => {
    tabNavigatorRef.current?.(tab);
  }, []);

  /** Wait for a metric to register (after tab switch) — resolves when the component mounts */
  const waitForMetric = useCallback((title: string, timeoutMs = 3000): Promise<AiMetric | null> => {
    // Check if already registered and live
    for (const [, m] of metricsRef.current) {
      if (m.title === title && m.render?.()) return Promise.resolve(m);
    }
    // Wait for registration
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        waitersRef.current.delete(title);
        resolve(null);
      }, timeoutMs);
      waitersRef.current.set(title, (metric) => {
        clearTimeout(timer);
        resolve(metric);
      });
    });
  }, []);

  const findTab = useCallback((title: string): string | undefined => {
    for (const [, metric] of metricsRef.current) {
      if (metric.title === title && metric.tab) return metric.tab;
    }
    return undefined;
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    setStreamingText("");
  }, [setMessages]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const send = useCallback(async (content: string, triggerContext?: string) => {
    if (!config?.analyze) return;

    const userMsg: AiMessage = { role: "user", content, timestamp: Date.now(), triggerContext };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    config.onMessage?.(userMsg);

    setIsLoading(true);
    setStreamingText("");

    const systemPrompt = buildSystemPrompt(config, metricsRef.current, filterContext);

    // Build LLM message array
    const llmMessages: { role: "user" | "assistant" | "system"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add trigger context if opened from a specific card
    if (triggerContext) {
      llmMessages.push({
        role: "system",
        content: `The user is asking specifically about: ${triggerContext}. Start your analysis there but connect to other metrics as relevant.`,
      });
    }

    // Add chat history
    for (const msg of newMessages) {
      llmMessages.push({ role: msg.role, content: msg.content });
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = config.analyze(llmMessages, { signal: controller.signal });

      if (result && typeof result === "object" && Symbol.asyncIterator in result) {
        // Streaming response
        let fullText = "";
        for await (const chunk of result as AsyncIterable<string>) {
          if (controller.signal.aborted) break;
          fullText += chunk;
          setStreamingText(fullText);
        }
        const assistantMsg: AiMessage = { role: "assistant", content: fullText, timestamp: Date.now() };
        setMessages((prev) => [...prev, assistantMsg]);
        config.onMessage?.(assistantMsg);
        setStreamingText("");
      } else {
        // Non-streaming response
        const text = await (result as Promise<string>);
        const assistantMsg: AiMessage = { role: "assistant", content: text, timestamp: Date.now() };
        setMessages((prev) => [...prev, assistantMsg]);
        config.onMessage?.(assistantMsg);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const errorMsg: AiMessage = {
          role: "assistant",
          content: `Analysis failed: ${(err as Error).message ?? "Unknown error"}. Check your AI configuration.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        config.onMessage?.(errorMsg);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [config, messages, setMessages, filterContext]);

  const value = useMemo<AiContextValue>(() => ({
    enabled: config != null,
    config,
    registerMetric,
    unregisterMetric,
    getMetrics,
    registerTabNavigator,
    navigateToTab,
    findTab,
    messages,
    send,
    clear,
    isLoading,
    streamingText,
    abort,
  }), [config, registerMetric, unregisterMetric, getMetrics, registerTabNavigator, navigateToTab, findTab, messages, send, clear, isLoading, streamingText, abort]);

  return (
    <AiCtx.Provider value={value}>
      {children}
    </AiCtx.Provider>
  );
}
