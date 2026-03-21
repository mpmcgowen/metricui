import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider, useMetricConfig, useLocale, DEFAULT_METRIC_CONFIG } from "@/lib/MetricProvider";
import { DEFAULT_MOTION_CONFIG } from "@/lib/motion";
import { SERIES_COLORS } from "@/lib/chartColors";
import { THEME_PRESETS } from "@/lib/themes";

// ---------------------------------------------------------------------------
// Helper: renders a component that reads config and dumps it as text
// ---------------------------------------------------------------------------

function ConfigDumper({ pick }: { pick?: (c: ReturnType<typeof useMetricConfig>) => string }) {
  const config = useMetricConfig();
  return <div data-testid="config">{pick ? pick(config) : JSON.stringify(config)}</div>;
}

function LocaleDumper() {
  const loc = useLocale();
  return <div data-testid="locale">{JSON.stringify(loc)}</div>;
}

// ---------------------------------------------------------------------------
// Default config
// ---------------------------------------------------------------------------

describe("MetricProvider — defaults", () => {
  it("has correct default locale", () => {
    expect(DEFAULT_METRIC_CONFIG.locale).toBe("en-US");
  });

  it("has correct default currency", () => {
    expect(DEFAULT_METRIC_CONFIG.currency).toBe("USD");
  });

  it("has animate enabled by default", () => {
    expect(DEFAULT_METRIC_CONFIG.animate).toBe(true);
  });

  it("has default variant", () => {
    expect(DEFAULT_METRIC_CONFIG.variant).toBe("default");
  });

  it("has default motion config", () => {
    expect(DEFAULT_METRIC_CONFIG.motionConfig).toEqual(DEFAULT_MOTION_CONFIG);
  });

  it("has default colors from SERIES_COLORS", () => {
    expect(DEFAULT_METRIC_CONFIG.colors).toEqual(SERIES_COLORS);
  });

  it("has dense false by default", () => {
    expect(DEFAULT_METRIC_CONFIG.dense).toBe(false);
  });

  it("has texture true by default", () => {
    expect(DEFAULT_METRIC_CONFIG.texture).toBe(true);
  });

  it("has nullDisplay as dash", () => {
    expect(DEFAULT_METRIC_CONFIG.nullDisplay).toBe("dash");
  });

  it("has chartNullMode as gap", () => {
    expect(DEFAULT_METRIC_CONFIG.chartNullMode).toBe("gap");
  });
});

// ---------------------------------------------------------------------------
// useMetricConfig
// ---------------------------------------------------------------------------

describe("useMetricConfig", () => {
  it("returns full config without a provider", () => {
    render(<ConfigDumper pick={(c) => c.locale} />);
    expect(screen.getByTestId("config").textContent).toBe("en-US");
  });

  it("returns overridden values from provider", () => {
    render(
      <MetricProvider animate={false}>
        <ConfigDumper pick={(c) => String(c.animate)} />
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// useLocale
// ---------------------------------------------------------------------------

describe("useLocale", () => {
  it("returns locale and currency", () => {
    render(<LocaleDumper />);
    const data = JSON.parse(screen.getByTestId("locale").textContent!);
    expect(data.locale).toBe("en-US");
    expect(data.currency).toBe("USD");
  });

  it("reflects provider overrides", () => {
    render(
      <MetricProvider locale="de-DE" currency="EUR">
        <LocaleDumper />
      </MetricProvider>,
    );
    const data = JSON.parse(screen.getByTestId("locale").textContent!);
    expect(data.locale).toBe("de-DE");
    expect(data.currency).toBe("EUR");
  });
});

// ---------------------------------------------------------------------------
// Config overrides
// ---------------------------------------------------------------------------

describe("MetricProvider — config overrides", () => {
  it("overrides animate", () => {
    render(
      <MetricProvider animate={false}>
        <ConfigDumper pick={(c) => String(c.animate)} />
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("false");
  });

  it("overrides variant", () => {
    render(
      <MetricProvider variant="outlined">
        <ConfigDumper pick={(c) => c.variant} />
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("outlined");
  });

  it("overrides dense", () => {
    render(
      <MetricProvider dense={true}>
        <ConfigDumper pick={(c) => String(c.dense)} />
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("true");
  });

  it("sets data-texture='false' when texture disabled", () => {
    const { container } = render(
      <MetricProvider texture={false}>
        <div data-testid="child">hi</div>
      </MetricProvider>,
    );
    const wrapper = container.querySelector("[data-texture='false']");
    expect(wrapper).toBeInTheDocument();
  });

  it("overrides nullDisplay", () => {
    render(
      <MetricProvider nullDisplay="empty">
        <ConfigDumper pick={(c) => c.nullDisplay} />
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("empty");
  });
});

// ---------------------------------------------------------------------------
// Nested providers
// ---------------------------------------------------------------------------

describe("MetricProvider — nesting", () => {
  it("inner provider overrides parent values", () => {
    render(
      <MetricProvider variant="elevated">
        <MetricProvider dense={true}>
          <ConfigDumper pick={(c) => `${c.variant}|${c.dense}`} />
        </MetricProvider>
      </MetricProvider>,
    );
    // Inner sets dense, inherits variant from outer
    expect(screen.getByTestId("config").textContent).toBe("elevated|true");
  });

  it("inner provider does not clobber unrelated parent values", () => {
    render(
      <MetricProvider locale="fr-FR" currency="EUR" animate={false}>
        <MetricProvider dense={true}>
          <ConfigDumper pick={(c) => `${c.locale}|${c.currency}|${c.animate}|${c.dense}`} />
        </MetricProvider>
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("fr-FR|EUR|false|true");
  });

  it("deeply nested providers compose correctly", () => {
    render(
      <MetricProvider locale="ja-JP">
        <MetricProvider currency="JPY">
          <MetricProvider dense={true}>
            <ConfigDumper pick={(c) => `${c.locale}|${c.currency}|${c.dense}`} />
          </MetricProvider>
        </MetricProvider>
      </MetricProvider>,
    );
    expect(screen.getByTestId("config").textContent).toBe("ja-JP|JPY|true");
  });
});

// ---------------------------------------------------------------------------
// Theme presets
// ---------------------------------------------------------------------------

describe("MetricProvider — themes", () => {
  it("applies emerald theme colors", () => {
    const emerald = THEME_PRESETS["emerald"];
    render(
      <MetricProvider theme="emerald">
        <ConfigDumper pick={(c) => JSON.stringify(c.colors)} />
      </MetricProvider>,
    );
    expect(JSON.parse(screen.getByTestId("config").textContent!)).toEqual(emerald.colors);
  });

  it("applies rose theme colors", () => {
    const rose = THEME_PRESETS["rose"];
    render(
      <MetricProvider theme="rose">
        <ConfigDumper pick={(c) => JSON.stringify(c.colors)} />
      </MetricProvider>,
    );
    expect(JSON.parse(screen.getByTestId("config").textContent!)).toEqual(rose.colors);
  });

  it("accepts custom theme object", () => {
    const custom = {
      name: "Custom",
      accent: "#FF0000",
      accentDark: "#FF6666",
      colors: ["#FF0000", "#00FF00", "#0000FF"],
    };
    render(
      <MetricProvider theme={custom}>
        <ConfigDumper pick={(c) => JSON.stringify(c.colors)} />
      </MetricProvider>,
    );
    expect(JSON.parse(screen.getByTestId("config").textContent!)).toEqual(custom.colors);
  });

  it("explicit colors override theme colors", () => {
    const overrideColors = ["#111", "#222", "#333"];
    render(
      <MetricProvider theme="emerald" colors={overrideColors}>
        <ConfigDumper pick={(c) => JSON.stringify(c.colors)} />
      </MetricProvider>,
    );
    expect(JSON.parse(screen.getByTestId("config").textContent!)).toEqual(overrideColors);
  });

  it("ignores unknown theme string gracefully", () => {
    render(
      <MetricProvider theme="nonexistent">
        <ConfigDumper pick={(c) => JSON.stringify(c.colors)} />
      </MetricProvider>,
    );
    // Falls back to default colors
    expect(JSON.parse(screen.getByTestId("config").textContent!)).toEqual(SERIES_COLORS);
  });
});
