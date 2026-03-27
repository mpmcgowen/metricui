import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastCalendarProps: any = null;

vi.mock("@nivo/calendar", () => ({
  ResponsiveCalendar: (props: any) => {
    lastCalendarProps = props;
    return <div data-testid="nivo-calendar" />;
  },
}));

vi.mock("@/lib/useContainerSize", () => ({
  useContainerSize: () => ({
    ref: { current: null },
    width: 800,
    height: 400,
  }),
}));

import { Calendar } from "@/components/charts/Calendar";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const nivoCalendarData = [
  { day: "2024-01-01", value: 10 },
  { day: "2024-01-15", value: 25 },
  { day: "2024-03-20", value: 50 },
  { day: "2024-06-30", value: 75 },
  { day: "2024-12-31", value: 100 },
];

const flatRowData = [
  { date: "2024-02-01", commits: 5 },
  { date: "2024-02-15", commits: 12 },
  { date: "2024-03-01", commits: 8 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Calendar", () => {
  beforeEach(() => {
    lastCalendarProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with Nivo-native data", () => {
    const { container } = renderWithProvider(
      <Calendar data={nivoCalendarData} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-calendar")).toBeInTheDocument();
  });

  it("renders with flat DataRow format", () => {
    renderWithProvider(
      <Calendar data={flatRowData} dateField="date" valueField="commits" />
    );
    expect(screen.getByTestId("nivo-calendar")).toBeInTheDocument();
    // Should transform to Nivo format
    expect(lastCalendarProps.data).toHaveLength(3);
    expect(lastCalendarProps.data[0]).toEqual({ day: "2024-02-01", value: 5 });
  });

  // --- Auto date range detection ---
  it("auto-derives from/to from data when not provided", () => {
    renderWithProvider(<Calendar data={nivoCalendarData} />);
    expect(lastCalendarProps.from).toBe("2024-01-01");
    expect(lastCalendarProps.to).toBe("2024-12-31");
  });

  it("auto-derives from/to from flat row data", () => {
    renderWithProvider(
      <Calendar data={flatRowData} dateField="date" valueField="commits" />
    );
    expect(lastCalendarProps.from).toBe("2024-02-01");
    expect(lastCalendarProps.to).toBe("2024-03-01");
  });

  it("uses explicit from/to when provided, overriding auto-detection", () => {
    renderWithProvider(
      <Calendar
        data={nivoCalendarData}
        from="2024-01-01"
        to="2025-01-01"
      />
    );
    expect(lastCalendarProps.from).toBe("2024-01-01");
    expect(lastCalendarProps.to).toBe("2025-01-01");
  });

  it("handles empty data gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(<Calendar data={[]} />);
    expect(container.firstChild).toBeTruthy();
    // Empty data → CardShell auto empty state, Nivo not rendered
  });

  // --- Empty / undefined data ---
  it("handles undefined data gracefully", () => {
    const { container } = renderWithProvider(<Calendar />);
    expect(container.firstChild).toBeTruthy();
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Calendar data={nivoCalendarData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} error={{ message: "API error" }} />
    );
    expect(screen.getByText("API error")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Calendar data={nivoCalendarData} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} title="Commit Activity" />
    );
    expect(screen.getByText("Commit Activity")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} title="Activity" subtitle="2024" />
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  // --- Direction ---
  it("defaults to horizontal direction", () => {
    renderWithProvider(<Calendar data={nivoCalendarData} />);
    expect(lastCalendarProps.direction).toBe("horizontal");
  });

  it("passes vertical direction", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} direction="vertical" />
    );
    expect(lastCalendarProps.direction).toBe("vertical");
  });

  // --- Colors ---
  it("passes custom colors", () => {
    const colors = ["#eee", "#bbb", "#888", "#555", "#222"];
    renderWithProvider(
      <Calendar data={nivoCalendarData} colors={colors} />
    );
    expect(lastCalendarProps.colors).toEqual(colors);
  });

  it("passes custom emptyColor", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} emptyColor="#f0f0f0" />
    );
    expect(lastCalendarProps.emptyColor).toBe("#f0f0f0");
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Calendar data={nivoCalendarData} data-testid="my-calendar" />
    );
    expect(screen.getByTestId("my-calendar")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick handler (always present for Calendar)", () => {
    renderWithProvider(<Calendar data={nivoCalendarData} />);
    // Calendar always has onClick defined for onDayClick support
    expect(lastCalendarProps.onClick).toBeTruthy();
  });

  // --- Edge cases ---
  it("handles single day of data", () => {
    const singleDay = [{ day: "2024-06-15", value: 42 }];
    renderWithProvider(<Calendar data={singleDay} />);
    expect(lastCalendarProps.data).toHaveLength(1);
    expect(lastCalendarProps.from).toBe("2024-06-15");
    expect(lastCalendarProps.to).toBe("2024-06-15");
  });

  it("handles data with zero values", () => {
    const zeroData = [
      { day: "2024-01-01", value: 0 },
      { day: "2024-01-02", value: 0 },
    ];
    renderWithProvider(<Calendar data={zeroData} />);
    expect(lastCalendarProps.data).toHaveLength(2);
  });

  it("handles large dataset spanning multiple years", () => {
    const largeData = Array.from({ length: 730 }, (_, i) => {
      const date = new Date(2023, 0, 1 + i);
      return {
        day: date.toISOString().slice(0, 10),
        value: Math.floor(Math.random() * 100),
      };
    });
    renderWithProvider(<Calendar data={largeData} />);
    expect(lastCalendarProps.data).toHaveLength(730);
    expect(lastCalendarProps.from).toBe("2023-01-01");
  });

  it("flat row format uses default field names (day, value) when not specified", () => {
    const defaultFieldData = [
      { day: "2024-05-01", value: 10 },
      { day: "2024-05-02", value: 20 },
    ];
    renderWithProvider(<Calendar data={defaultFieldData} />);
    // Should auto-detect as Nivo format since it has `day` and `value`
    expect(lastCalendarProps.data).toHaveLength(2);
  });
});
