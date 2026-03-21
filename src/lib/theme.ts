export const colors = {
  // Primary palette — carefully tuned for data visualization
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },

  // Chart series colors — max contrast, colorblind-safe
  series: [
    "#6366F1", // indigo
    "#06B6D4", // cyan
    "#F59E0B", // amber
    "#EC4899", // pink
    "#10B981", // emerald
    "#F97316", // orange
    "#8B5CF6", // violet
    "#14B8A6", // teal
  ],

  // Semantic colors
  positive: "#10B981",
  negative: "#EF4444",
  warning: "#F59E0B",
  neutral: "#6B7280",

  // Surface colors
  surface: {
    light: "#FFFFFF",
    dark: "#0F1117",
  },
  surfaceSecondary: {
    light: "#F9FAFB",
    dark: "#1A1D2E",
  },
  border: {
    light: "#E5E7EB",
    dark: "#2A2D3E",
  },
  text: {
    primary: { light: "#111827", dark: "#F9FAFB" },
    secondary: { light: "#6B7280", dark: "#9CA3AF" },
    muted: { light: "#9CA3AF", dark: "#6B7280" },
  },
};

// NOTE: The nivo chart theme is now provided by the `useChartTheme` hook
// in src/lib/useChartTheme.ts. The old `getNivoTheme` function has been
// removed as part of the shared utilities refactor.
