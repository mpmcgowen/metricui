"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", enterprise: 38400, startup: 28600, smb: 17200 },
  { month: "Feb", enterprise: 40100, startup: 29200, smb: 18200 },
  { month: "Mar", enterprise: 42300, startup: 30100, smb: 19400 },
  { month: "Apr", enterprise: 40800, startup: 29800, smb: 18800 },
  { month: "May", enterprise: 43600, startup: 30900, smb: 19700 },
  { month: "Jun", enterprise: 45200, startup: 32100, smb: 20800 },
  { month: "Jul", enterprise: 44100, startup: 31800, smb: 20600 },
  { month: "Aug", enterprise: 46800, startup: 33200, smb: 21400 },
  { month: "Sep", enterprise: 49100, startup: 34300, smb: 22400 },
  { month: "Oct", enterprise: 50800, startup: 35400, smb: 23000 },
  { month: "Nov", enterprise: 52900, startup: 36700, smb: 23900 },
  { month: "Dec", enterprise: 59400, startup: 41200, smb: 26850 },
];

export function RechartsChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
        <Legend />
        <Area type="monotone" dataKey="enterprise" stackId="1"
          fill="#6366f1" stroke="#6366f1" />
        <Area type="monotone" dataKey="startup" stackId="1"
          fill="#8b5cf6" stroke="#8b5cf6" />
        <Area type="monotone" dataKey="smb" stackId="1"
          fill="#a78bfa" stroke="#a78bfa" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
