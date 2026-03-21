"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WikiEdit {
  id: number;
  title: string;
  user: string;
  wiki: string;
  type: "edit" | "new" | "categorize" | "log";
  bot: boolean;
  minor: boolean;
  timestamp: number;
  lengthOld: number | null;
  lengthNew: number | null;
  comment: string;
}

export interface WikiStreamStats {
  /** Total edits received since connection */
  totalEdits: number;
  /** Edits in the current minute */
  editsPerMinute: number;
  /** Unique editors seen */
  uniqueEditors: number;
  /** Bot edits vs total */
  botEditCount: number;
  /** Largest edit by byte change */
  largestEdit: WikiEdit | null;
  /** Edit counts by wiki (e.g., { enwiki: 42, dewiki: 18 }) */
  editsByWiki: Record<string, number>;
  /** Edit counts by type */
  editsByType: Record<string, number>;
  /** Recent edit rate — edits per second averaged over last 30s */
  editRate: number;
  /** Rolling sparkline of edits per 5-second bucket (last 5 minutes) */
  editRateHistory: number[];
  /** Rolling bot edits per bucket (same window as editRateHistory) */
  botRateHistory: number[];
  /** Rolling human edits per bucket */
  humanRateHistory: number[];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const STREAM_URL = "https://stream.wikimedia.org/v2/stream/recentchange";
const RATE_BUCKET_MS = 5000; // 5-second buckets for sparkline
const RATE_HISTORY_LENGTH = 60; // 60 buckets = 5 minutes
const MAX_RECENT_EDITS = 50;

export function useWikipediaStream(enabled = true) {
  const [connected, setConnected] = useState(false);
  /** True until we've received and flushed at least one batch of events */
  const [loading, setLoading] = useState(true);
  const [recentEdits, setRecentEdits] = useState<WikiEdit[]>([]);
  const [stats, setStats] = useState<WikiStreamStats>({
    totalEdits: 0,
    editsPerMinute: 0,
    uniqueEditors: 0,
    botEditCount: 0,
    largestEdit: null,
    editsByWiki: {},
    editsByType: {},
    editRate: 0,
    editRateHistory: [],
    botRateHistory: [],
    humanRateHistory: [],
  });

  // Mutable refs for accumulating data without re-renders on every event
  const totalRef = useRef(0);
  const botCountRef = useRef(0);
  const editorsRef = useRef(new Set<string>());
  const byWikiRef = useRef<Record<string, number>>({});
  const byTypeRef = useRef<Record<string, number>>({});
  const largestRef = useRef<WikiEdit | null>(null);
  const recentRef = useRef<WikiEdit[]>([]);
  const bucketCountRef = useRef(0);
  const bucketBotRef = useRef(0);
  const bucketHumanRef = useRef(0);
  const historyRef = useRef<number[]>([]);
  const botHistoryRef = useRef<number[]>([]);
  const humanHistoryRef = useRef<number[]>([]);
  const minuteCountRef = useRef(0);
  const minuteStartRef = useRef(Date.now());
  const hasReceivedFirstEvent = useRef(false);
  const initialFlushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flush accumulated data to state periodically
  const flush = useCallback(() => {
    const now = Date.now();

    // Push current bucket to history
    historyRef.current = [
      ...historyRef.current.slice(-(RATE_HISTORY_LENGTH - 1)),
      bucketCountRef.current,
    ];
    const recentBuckets = historyRef.current.slice(-6); // last 30s
    const editRate =
      recentBuckets.length > 0
        ? recentBuckets.reduce((a, b) => a + b, 0) /
          (recentBuckets.length * (RATE_BUCKET_MS / 1000))
        : 0;
    botHistoryRef.current = [
      ...botHistoryRef.current.slice(-(RATE_HISTORY_LENGTH - 1)),
      bucketBotRef.current,
    ];
    humanHistoryRef.current = [
      ...humanHistoryRef.current.slice(-(RATE_HISTORY_LENGTH - 1)),
      bucketHumanRef.current,
    ];
    bucketCountRef.current = 0;
    bucketBotRef.current = 0;
    bucketHumanRef.current = 0;

    // Edits per minute
    if (now - minuteStartRef.current >= 60000) {
      minuteCountRef.current = 0;
      minuteStartRef.current = now;
    }

    setStats({
      totalEdits: totalRef.current,
      editsPerMinute: minuteCountRef.current,
      uniqueEditors: editorsRef.current.size,
      botEditCount: botCountRef.current,
      largestEdit: largestRef.current,
      editsByWiki: { ...byWikiRef.current },
      editsByType: { ...byTypeRef.current },
      editRate: Math.round(editRate * 10) / 10,
      editRateHistory: [...historyRef.current],
      botRateHistory: [...botHistoryRef.current],
      humanRateHistory: [...humanHistoryRef.current],
    });

    setRecentEdits([...recentRef.current]);

    // Clear loading once we have data
    if (totalRef.current > 0) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const eventSource = new EventSource(STREAM_URL);

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only process actual edits and new pages (skip log, categorize for noise)
        const type = data.type as string;
        if (!["edit", "new", "categorize"].includes(type)) return;

        const edit: WikiEdit = {
          id: data.id,
          title: data.title ?? "",
          user: data.user ?? "anonymous",
          wiki: data.wiki ?? "unknown",
          type: type as WikiEdit["type"],
          bot: data.bot ?? false,
          minor: data.minor ?? false,
          timestamp: data.timestamp ?? Math.floor(Date.now() / 1000),
          lengthOld: data.length?.old ?? null,
          lengthNew: data.length?.new ?? null,
          comment: data.comment ?? "",
        };

        // Accumulate
        totalRef.current++;
        bucketCountRef.current++;
        minuteCountRef.current++;

        // Trigger an early flush shortly after first event (don't wait 5s)
        if (!hasReceivedFirstEvent.current) {
          hasReceivedFirstEvent.current = true;
          initialFlushTimer.current = setTimeout(flush, 500);
        }
        editorsRef.current.add(edit.user);
        if (edit.bot) {
          botCountRef.current++;
          bucketBotRef.current++;
        } else {
          bucketHumanRef.current++;
        }

        byWikiRef.current[edit.wiki] =
          (byWikiRef.current[edit.wiki] ?? 0) + 1;
        byTypeRef.current[edit.type] =
          (byTypeRef.current[edit.type] ?? 0) + 1;

        // Track largest edit
        if (edit.lengthOld !== null && edit.lengthNew !== null) {
          const change = Math.abs(edit.lengthNew - edit.lengthOld);
          const currentLargest = largestRef.current;
          if (
            !currentLargest ||
            change >
              Math.abs(
                (currentLargest.lengthNew ?? 0) -
                  (currentLargest.lengthOld ?? 0)
              )
          ) {
            largestRef.current = edit;
          }
        }

        // Keep recent edits capped
        recentRef.current = [edit, ...recentRef.current].slice(
          0,
          MAX_RECENT_EDITS
        );
      } catch {
        // Skip malformed events
      }
    };

    // Flush to React state every RATE_BUCKET_MS
    const flushInterval = setInterval(flush, RATE_BUCKET_MS);

    return () => {
      eventSource.close();
      clearInterval(flushInterval);
      if (initialFlushTimer.current) clearTimeout(initialFlushTimer.current);
      setConnected(false);
    };
  }, [enabled, flush]);

  return { connected, loading, recentEdits, stats };
}
