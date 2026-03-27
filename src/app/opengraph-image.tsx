import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MetricUI — Dashboard Components for React";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            MetricUI
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.75)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            Dashboard Components for React
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
