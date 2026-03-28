import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@metricui/core": "../Desktop/metriccore/dist/index.js",
    },
  },
};

export default nextConfig;
