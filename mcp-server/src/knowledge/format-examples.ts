/**
 * MetricUI MCP Server — Format Examples Lookup Table
 *
 * Maps value types to recommended format options with concrete examples.
 */

export interface FormatExample {
  valueType: string;
  keywords: string[];
  formatOption: string;
  example: { input: number; output: string };
}

export const FORMAT_EXAMPLES: FormatExample[] = [
  // === Currency ===
  {
    valueType: "currency (USD, compact)",
    keywords: ["money", "revenue", "price", "cost", "dollar", "usd", "sales", "mrr", "arr", "arpu", "ltv", "aov", "gmv"],
    formatOption: '"currency"',
    example: { input: 142300, output: "$142.3K" },
  },
  {
    valueType: "currency (USD, full precision)",
    keywords: ["exact price", "invoice", "payment", "charge", "fee"],
    formatOption: '{ style: "currency", compact: false, precision: 2 }',
    example: { input: 142300.5, output: "$142,300.50" },
  },
  {
    valueType: "currency (EUR)",
    keywords: ["euro", "eur", "european"],
    formatOption: '{ style: "currency", currency: "EUR" }',
    example: { input: 142300, output: "\u20AC142.3K" },
  },
  {
    valueType: "currency (GBP)",
    keywords: ["pound", "gbp", "british", "sterling"],
    formatOption: '{ style: "currency", currency: "GBP" }',
    example: { input: 142300, output: "\u00A3142.3K" },
  },
  {
    valueType: "currency (custom, no compact)",
    keywords: ["cents", "micropayment", "precise currency"],
    formatOption: '{ style: "currency", compact: false, precision: 2 }',
    example: { input: 9.99, output: "$9.99" },
  },

  // === Percent ===
  {
    valueType: "percentage (whole input, 0 decimals — default)",
    keywords: ["percent", "rate", "ratio", "conversion", "churn", "bounce", "ctr", "open rate", "click rate", "humidity"],
    formatOption: '"percent"',
    example: { input: 81, output: "81%" },
  },
  {
    valueType: "percentage (with 1 decimal)",
    keywords: ["precise percent", "decimal percent display"],
    formatOption: '{ style: "percent", precision: 1 }',
    example: { input: 12.5, output: "12.5%" },
  },
  {
    valueType: "percentage (decimal input, e.g. 0.12 = 12%)",
    keywords: ["decimal percent", "fraction", "0.12 means 12%"],
    formatOption: '{ style: "percent", percentInput: "decimal" }',
    example: { input: 0.125, output: "13%" },
  },

  // === Numbers ===
  {
    valueType: "number (compact)",
    keywords: ["count", "total", "number", "quantity", "users", "sessions", "visits", "views", "impressions", "items"],
    formatOption: '"number"',
    example: { input: 12450, output: "12.5K" },
  },
  {
    valueType: "number (compact, explicit)",
    keywords: ["compact", "abbreviated", "short number"],
    formatOption: '"compact"',
    example: { input: 3500000, output: "3.5M" },
  },
  {
    valueType: "number (full, no compact)",
    keywords: ["full number", "exact count", "no abbreviation"],
    formatOption: '{ style: "number", compact: false }',
    example: { input: 12450, output: "12,450" },
  },
  {
    valueType: "number (forced millions)",
    keywords: ["millions", "in millions", "mm"],
    formatOption: '{ style: "number", compact: "millions" }',
    example: { input: 3500000, output: "3.5M" },
  },
  {
    valueType: "number (forced billions)",
    keywords: ["billions", "in billions", "bn"],
    formatOption: '{ style: "number", compact: "billions" }',
    example: { input: 1200000000, output: "1.2B" },
  },
  {
    valueType: "number (with suffix)",
    keywords: ["custom suffix", "units", "items suffix"],
    formatOption: '{ style: "number", compact: false, suffix: " users" }',
    example: { input: 12450, output: "12,450 users" },
  },
  {
    valueType: "number (with prefix)",
    keywords: ["custom prefix", "approximately", "tilde"],
    formatOption: '{ style: "number", prefix: "~" }',
    example: { input: 12450, output: "~12.5K" },
  },

  // === Duration ===
  {
    valueType: "duration (from seconds, compact)",
    keywords: ["time", "duration", "elapsed", "response time", "latency", "uptime", "session length"],
    formatOption: '"duration"',
    example: { input: 330, output: "5m 30s" },
  },
  {
    valueType: "duration (from seconds, long)",
    keywords: ["long duration", "verbose time", "full words"],
    formatOption: '{ style: "duration", durationStyle: "long" }',
    example: { input: 330, output: "5 minutes 30 seconds" },
  },
  {
    valueType: "duration (from seconds, clock)",
    keywords: ["clock", "timer", "stopwatch", "digital clock"],
    formatOption: '{ style: "duration", durationStyle: "clock" }',
    example: { input: 330, output: "5:30" },
  },
  {
    valueType: "duration (from seconds, narrow)",
    keywords: ["narrow duration", "single unit", "decimal duration"],
    formatOption: '{ style: "duration", durationStyle: "narrow" }',
    example: { input: 330, output: "5.5m" },
  },
  {
    valueType: "duration (from milliseconds)",
    keywords: ["milliseconds", "ms", "response time ms", "api latency"],
    formatOption: '{ style: "duration", durationInput: "milliseconds" }',
    example: { input: 1250, output: "1s" },
  },
  {
    valueType: "duration (from minutes)",
    keywords: ["minutes input", "meeting length", "call duration"],
    formatOption: '{ style: "duration", durationInput: "minutes" }',
    example: { input: 90, output: "1h 30m" },
  },
  {
    valueType: "duration (from hours)",
    keywords: ["hours input", "project hours", "billable hours"],
    formatOption: '{ style: "duration", durationInput: "hours" }',
    example: { input: 2.5, output: "2h 30m" },
  },
  {
    valueType: "duration (precision: minutes)",
    keywords: ["no seconds", "hours and minutes only"],
    formatOption: '{ style: "duration", durationPrecision: "minutes" }',
    example: { input: 7380, output: "2h 3m" },
  },

  // === Custom / specialty ===
  {
    valueType: "score (out of 100)",
    keywords: ["score", "rating", "nps", "satisfaction", "health score"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: "/100" }',
    example: { input: 78, output: "78/100" },
  },
  {
    valueType: "multiplier",
    keywords: ["multiplier", "factor", "times", "x"],
    formatOption: '{ style: "number", compact: false, precision: 1, suffix: "x" }',
    example: { input: 3.2, output: "3.2x" },
  },
  {
    valueType: "temperature (Fahrenheit)",
    keywords: ["temperature", "fahrenheit", "weather", "degrees f"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: "°F" }',
    example: { input: 34, output: "34°F" },
  },
  {
    valueType: "temperature (Celsius)",
    keywords: ["temperature", "celsius", "degrees c"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: "°C" }',
    example: { input: 22, output: "22°C" },
  },
  {
    valueType: "speed (mph)",
    keywords: ["speed", "mph", "miles per hour", "wind speed", "velocity"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: " mph" }',
    example: { input: 13, output: "13 mph" },
  },
  {
    valueType: "speed (km/h)",
    keywords: ["speed", "kmh", "kilometers per hour"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: " km/h" }',
    example: { input: 80, output: "80 km/h" },
  },
  {
    valueType: "pressure (hPa)",
    keywords: ["pressure", "hpa", "barometric", "atmospheric", "millibar"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: " hPa" }',
    example: { input: 1013, output: "1013 hPa" },
  },
  {
    valueType: "distance (miles)",
    keywords: ["distance", "miles", "visibility", "range"],
    formatOption: '{ style: "number", compact: false, precision: 0, suffix: " mi" }',
    example: { input: 11, output: "11 mi" },
  },
  {
    valueType: "weight (kg)",
    keywords: ["weight", "kg", "kilograms", "mass"],
    formatOption: '{ style: "number", compact: false, precision: 1, suffix: " kg" }',
    example: { input: 72.5, output: "72.5 kg" },
  },
  {
    valueType: "file size (bytes to readable)",
    keywords: ["bytes", "file size", "storage", "data size"],
    formatOption: '{ style: "number", compact: "auto", suffix: "B" }',
    example: { input: 1048576, output: "1MB" },
  },
];
