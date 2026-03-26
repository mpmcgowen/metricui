import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AiProvider, useAi, type AiConfig } from "@/lib/AiContext";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Wrappers
// ---------------------------------------------------------------------------

function wrapWithAi(config: AiConfig | null) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AiProvider config={config}>{children}</AiProvider>;
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AiContext", () => {
  it("useAi returns null without AiProvider", () => {
    const { result } = renderHook(() => useAi());
    expect(result.current).toBeNull();
  });

  it("useAi returns enabled:true when config is provided", () => {
    const analyze = vi.fn().mockResolvedValue("test");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });
    expect(result.current).not.toBeNull();
    expect(result.current!.enabled).toBe(true);
  });

  it("useAi returns enabled:false when config is null", () => {
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi(null),
    });
    expect(result.current).not.toBeNull();
    expect(result.current!.enabled).toBe(false);
  });

  it("registerMetric adds metric to the map", () => {
    const analyze = vi.fn().mockResolvedValue("test");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    act(() => {
      result.current!.registerMetric("rev-1", {
        component: "KpiCard",
        title: "Revenue",
        data: { value: 5000 },
      });
    });

    const metrics = result.current!.getMetrics();
    expect(metrics.has("rev-1")).toBe(true);
    expect(metrics.get("rev-1")!.title).toBe("Revenue");
  });

  it("unregisterMetric removes metric from the map", () => {
    const analyze = vi.fn().mockResolvedValue("test");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    act(() => {
      result.current!.registerMetric("rev-1", {
        component: "KpiCard",
        title: "Revenue",
        data: { value: 5000 },
      });
    });
    expect(result.current!.getMetrics().has("rev-1")).toBe(true);

    act(() => {
      result.current!.unregisterMetric("rev-1");
    });
    expect(result.current!.getMetrics().has("rev-1")).toBe(false);
  });

  it("send() calls the analyze function with correct message format", async () => {
    const analyze = vi.fn().mockResolvedValue("AI response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    await act(async () => {
      await result.current!.send("What is the revenue trend?");
    });

    expect(analyze).toHaveBeenCalledTimes(1);
    const callArgs = analyze.mock.calls[0][0];
    // First message should be system prompt
    expect(callArgs[0].role).toBe("system");
    // Last message should be the user message
    expect(callArgs[callArgs.length - 1].role).toBe("user");
    expect(callArgs[callArgs.length - 1].content).toBe("What is the revenue trend?");
  });

  it("send() adds user message to messages array", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    expect(result.current!.messages.length).toBe(0);

    await act(async () => {
      await result.current!.send("Hello");
    });

    // Should have user message + assistant response
    expect(result.current!.messages.length).toBe(2);
    expect(result.current!.messages[0].role).toBe("user");
    expect(result.current!.messages[0].content).toBe("Hello");
    expect(result.current!.messages[1].role).toBe("assistant");
    expect(result.current!.messages[1].content).toBe("Response");
  });

  it("clear() empties messages", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    await act(async () => {
      await result.current!.send("Hello");
    });
    expect(result.current!.messages.length).toBe(2);

    act(() => {
      result.current!.clear();
    });
    expect(result.current!.messages.length).toBe(0);
  });

  it("system prompt includes company and context from config", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const config: AiConfig = {
      analyze,
      company: "Acme Corp",
      context: "SaaS revenue dashboard",
    };
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi(config),
    });

    await act(async () => {
      await result.current!.send("Analyze");
    });

    const systemMsg = analyze.mock.calls[0][0][0];
    expect(systemMsg.role).toBe("system");
    expect(systemMsg.content).toContain("Acme Corp");
    expect(systemMsg.content).toContain("SaaS revenue dashboard");
  });

  it("system prompt includes registered metric data", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    act(() => {
      result.current!.registerMetric("rev", {
        component: "KpiCard",
        title: "Monthly Revenue",
        data: { value: "$50,000" },
      });
    });

    await act(async () => {
      await result.current!.send("Analyze revenue");
    });

    const systemMsg = analyze.mock.calls[0][0][0];
    expect(systemMsg.content).toContain("Monthly Revenue");
    expect(systemMsg.content).toContain("KpiCard");
    expect(systemMsg.content).toContain("$50,000");
  });

  it("system prompt includes aiContext from metrics", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    act(() => {
      result.current!.registerMetric("churn", {
        component: "LineChart",
        title: "Churn Rate",
        data: { value: "4.2%" },
        aiContext: "This metric has been trending up since the price increase in January.",
      });
    });

    await act(async () => {
      await result.current!.send("What about churn?");
    });

    const systemMsg = analyze.mock.calls[0][0][0];
    expect(systemMsg.content).toContain("This metric has been trending up since the price increase in January.");
  });

  it("send() passes triggerContext as additional system message", async () => {
    const analyze = vi.fn().mockResolvedValue("Response");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze }),
    });

    await act(async () => {
      await result.current!.send("Tell me more", "Revenue Card");
    });

    const messages = analyze.mock.calls[0][0];
    // Should have a system message mentioning the trigger context
    const triggerMsg = messages.find(
      (m: any) => m.role === "system" && m.content.includes("Revenue Card"),
    );
    expect(triggerMsg).toBeTruthy();
  });

  it("onMessage callback fires for each message", async () => {
    const onMessage = vi.fn();
    const analyze = vi.fn().mockResolvedValue("AI says hello");
    const { result } = renderHook(() => useAi(), {
      wrapper: wrapWithAi({ analyze, onMessage }),
    });

    await act(async () => {
      await result.current!.send("Hi");
    });

    // Should fire for user message and assistant response
    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage.mock.calls[0][0].role).toBe("user");
    expect(onMessage.mock.calls[1][0].role).toBe("assistant");
  });
});
