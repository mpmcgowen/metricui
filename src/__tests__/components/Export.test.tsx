import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { exportFilename, generateCsv } from "@/lib/export";

// ---------------------------------------------------------------------------
// Pure function tests (no DOM needed)
// ---------------------------------------------------------------------------

describe("exportFilename", () => {
  it("generates correct pattern: Title — Date.ext", () => {
    const name = exportFilename("Revenue", "png");
    // Should end with .png
    expect(name).toMatch(/\.png$/);
    // Should contain the title
    expect(name).toContain("Revenue");
    // Should contain a date-like string (e.g., "Mar 26, 2026")
    expect(name).toMatch(/\w{3} \d{1,2}, \d{4}/);
  });

  it("generates correct pattern: Title — Filters — Date.ext", () => {
    const name = exportFilename("Revenue", "csv", "US, Pro");
    expect(name).toMatch(/\.csv$/);
    expect(name).toContain("Revenue");
    expect(name).toContain("US, Pro");
    // Parts should be separated by em dashes
    expect(name).toContain(" — ");
  });

  it("strips unsafe filename characters", () => {
    const name = exportFilename("Revenue: Q1/Q2", "csv");
    // Colons and slashes should be removed
    expect(name).not.toContain(":");
    expect(name).not.toContain("/");
  });

  it("collapses multiple spaces", () => {
    const name = exportFilename("Revenue   Report", "csv");
    expect(name).not.toContain("   ");
  });
});

describe("generateCsv", () => {
  const sampleData = [
    { region: "US", revenue: 1000, plan: "Pro" },
    { region: "EU", revenue: 2000, plan: "Free" },
    { region: "APAC", revenue: 1500, plan: "Enterprise" },
  ];

  it("produces correct CSV from data array", () => {
    const csv = generateCsv(sampleData);
    const lines = csv.split("\n");
    // Header row
    expect(lines[0]).toBe("region,revenue,plan");
    // Data rows
    expect(lines[1]).toBe("US,1000,Pro");
    expect(lines[2]).toBe("EU,2000,Free");
    expect(lines[3]).toBe("APAC,1500,Enterprise");
    expect(lines.length).toBe(4);
  });

  it("uses custom column definitions when provided", () => {
    const columns = [
      { key: "region", header: "Region" },
      { key: "revenue", header: "Total Revenue" },
    ];
    const csv = generateCsv(sampleData, columns);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Region,Total Revenue");
    // Only two columns per row
    expect(lines[1]).toBe("US,1000");
  });

  it("includes metadata header when provided", () => {
    const csv = generateCsv(sampleData, undefined, "Period: Last 30d · Region: US");
    const lines = csv.split("\n");
    expect(lines[0]).toBe("# Period: Last 30d · Region: US");
    expect(lines[1]).toBe(""); // blank line after metadata
    expect(lines[2]).toBe("region,revenue,plan"); // header row
  });

  it("returns empty string for empty data", () => {
    expect(generateCsv([])).toBe("");
  });

  it("handles null values in data", () => {
    const data = [{ a: "hello", b: null, c: 42 }];
    const csv = generateCsv(data as any);
    const lines = csv.split("\n");
    expect(lines[1]).toBe("hello,,42");
  });

  it("escapes commas in string values", () => {
    const data = [{ name: "Acme, Inc.", revenue: 1000 }];
    const csv = generateCsv(data);
    const lines = csv.split("\n");
    // Comma-containing value should be quoted
    expect(lines[1]).toBe('"Acme, Inc.",1000');
  });

  it("escapes double quotes in string values", () => {
    const data = [{ name: 'Say "hello"', revenue: 1000 }];
    const csv = generateCsv(data);
    const lines = csv.split("\n");
    // Quotes should be doubled and value wrapped in quotes
    expect(lines[1]).toBe('"Say ""hello""",1000');
  });

  it("escapes newlines in string values", () => {
    const data = [{ name: "Line1\nLine2", revenue: 1000 }];
    const csv = generateCsv(data);
    const lines = csv.split("\n");
    // Newline-containing value should be quoted (the raw CSV will have the newline inside quotes)
    expect(csv).toContain('"Line1\nLine2"');
  });

  it("applies format function from column definition", () => {
    const data = [{ revenue: 1000 }, { revenue: 2500 }];
    const columns = [
      { key: "revenue", header: "Revenue", format: (v: unknown) => `$${Number(v).toLocaleString()}` },
    ];
    const csv = generateCsv(data, columns);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Revenue");
    expect(lines[1]).toContain("$");
  });
});
