import { defineConfig } from "tsup";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  entry: ["src/components/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  tsconfig: "tsconfig.build.json",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@nivo/bar",
    "@nivo/bullet",
    "@nivo/core",
    "@nivo/funnel",
    "@nivo/heatmap",
    "@nivo/line",
    "@nivo/pie",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  outDir: "dist",
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
    };
  },
  async onSuccess() {
    // Inject "use client" directive at the top of ESM and CJS bundles.
    // Rollup strips the directive from ESM during bundling, so we add it back.
    const files = ["dist/index.mjs", "dist/index.js"];
    for (const file of files) {
      const filePath = path.resolve(__dirname, file);
      const content = readFileSync(filePath, "utf-8");
      if (!content.startsWith('"use client"')) {
        writeFileSync(filePath, `"use client";\n${content}`);
      }
    }
  },
});
