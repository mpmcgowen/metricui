"use client";

// Tremor uses Recharts under the hood with Tailwind styling.
// Since Tremor's Tailwind classes aren't processed by our docs site,
// we render the equivalent Recharts output that Tremor produces.

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan 2024", Enterprise: 38400, Startup: 28600, SMB: 17200 },
  { month: "Feb 2024", Enterprise: 40100, Startup: 29200, SMB: 18200 },
  { month: "Mar 2024", Enterprise: 42300, Startup: 30100, SMB: 19400 },
  { month: "Apr 2024", Enterprise: 40800, Startup: 29800, SMB: 18800 },
  { month: "May 2024", Enterprise: 43600, Startup: 30900, SMB: 19700 },
  { month: "Jun 2024", Enterprise: 45200, Startup: 32100, SMB: 20800 },
  { month: "Jul 2024", Enterprise: 44100, Startup: 31800, SMB: 20600 },
  { month: "Aug 2024", Enterprise: 46800, Startup: 33200, SMB: 21400 },
  { month: "Sep 2024", Enterprise: 49100, Startup: 34300, SMB: 22400 },
  { month: "Oct 2024", Enterprise: 50800, Startup: 35400, SMB: 23000 },
  { month: "Nov 2024", Enterprise: 52900, Startup: 36700, SMB: 23900 },
  { month: "Dec 2024", Enterprise: 59400, Startup: 41200, SMB: 26850 },
];

export function TremorChart() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Revenue by Segment</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
          <Legend />
          <Area type="monotone" dataKey="Enterprise" stackId="1"
            fill="#6366f1" stroke="#6366f1" fillOpacity={0.4} />
          <Area type="monotone" dataKey="Startup" stackId="1"
            fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.4} />
          <Area type="monotone" dataKey="SMB" stackId="1"
            fill="#a78bfa" stroke="#a78bfa" fillOpacity={0.4} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
