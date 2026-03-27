"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
);

const labels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const data = {
  labels,
  datasets: [
    {
      label: "Enterprise",
      data: [38400, 40100, 42300, 40800, 43600, 45200,
             44100, 46800, 49100, 50800, 52900, 59400],
      fill: true,
      backgroundColor: "rgba(99, 102, 241, 0.3)",
      borderColor: "#6366f1",
    },
    {
      label: "Startup",
      data: [28600, 29200, 30100, 29800, 30900, 32100,
             31800, 33200, 34300, 35400, 36700, 41200],
      fill: true,
      backgroundColor: "rgba(139, 92, 246, 0.3)",
      borderColor: "#8b5cf6",
    },
    {
      label: "SMB",
      data: [17200, 18200, 19400, 18800, 19700, 20800,
             20600, 21400, 22400, 23000, 23900, 26850],
      fill: true,
      backgroundColor: "rgba(167, 139, 250, 0.3)",
      borderColor: "#a78bfa",
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options: any = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    tooltip: {
      callbacks: {
        label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
          `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    y: {
      stacked: true,
      ticks: { callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k` },
    },
    x: { stacked: true },
  },
};

export function ChartjsChart() {
  return <Line data={data} options={options} />;
}
