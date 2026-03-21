// Sample data for the demo dashboard

export const revenueData = [
  {
    id: "Revenue",
    data: [
      { x: "Jan", y: 42000 },
      { x: "Feb", y: 45200 },
      { x: "Mar", y: 48100 },
      { x: "Apr", y: 51800 },
      { x: "May", y: 49200 },
      { x: "Jun", y: 55400 },
      { x: "Jul", y: 58900 },
      { x: "Aug", y: 62100 },
      { x: "Sep", y: 59800 },
      { x: "Oct", y: 65200 },
      { x: "Nov", y: 71000 },
      { x: "Dec", y: 78400 },
    ],
  },
];

export const userGrowthData = [
  {
    id: "New Users",
    data: [
      { x: "Jan", y: 1200 },
      { x: "Feb", y: 1350 },
      { x: "Mar", y: 1580 },
      { x: "Apr", y: 1420 },
      { x: "May", y: 1690 },
      { x: "Jun", y: 1840 },
      { x: "Jul", y: 2100 },
      { x: "Aug", y: 2350 },
      { x: "Sep", y: 2180 },
      { x: "Oct", y: 2560 },
      { x: "Nov", y: 2890 },
      { x: "Dec", y: 3200 },
    ],
  },
  {
    id: "Returning Users",
    data: [
      { x: "Jan", y: 4200 },
      { x: "Feb", y: 4500 },
      { x: "Mar", y: 4800 },
      { x: "Apr", y: 5100 },
      { x: "May", y: 5400 },
      { x: "Jun", y: 5900 },
      { x: "Jul", y: 6200 },
      { x: "Aug", y: 6800 },
      { x: "Sep", y: 7100 },
      { x: "Oct", y: 7600 },
      { x: "Nov", y: 8200 },
      { x: "Dec", y: 8900 },
    ],
  },
];

export const channelBarData = [
  { channel: "Organic", visitors: 14200, conversions: 1420 },
  { channel: "Direct", visitors: 8900, conversions: 1120 },
  { channel: "Referral", visitors: 6700, conversions: 670 },
  { channel: "Social", visitors: 5400, conversions: 380 },
  { channel: "Email", visitors: 4100, conversions: 820 },
  { channel: "Paid", visitors: 3200, conversions: 640 },
];

export const trafficSourceData = [
  { id: "organic", label: "Organic", value: 42 },
  { id: "direct", label: "Direct", value: 26 },
  { id: "referral", label: "Referral", value: 16 },
  { id: "social", label: "Social", value: 10 },
  { id: "email", label: "Email", value: 6 },
];

export const tableData = [
  { page: "/pricing", views: 12847, uniques: 9231, bounceRate: 32.1, avgTime: "2m 45s", trend: 12.3, sparkline: [8200, 9100, 10400, 11200, 10800, 12100, 12847], status: "healthy", convRate: 78 },
  { page: "/features", views: 9432, uniques: 7102, bounceRate: 28.7, avgTime: "3m 12s", trend: 8.1, sparkline: [7800, 8100, 8400, 8900, 9100, 9200, 9432], status: "healthy", convRate: 65 },
  { page: "/blog/launch", views: 8291, uniques: 6845, bounceRate: 45.2, avgTime: "4m 03s", trend: 24.5, sparkline: [3200, 4100, 5800, 6200, 7100, 7800, 8291], status: "healthy", convRate: 42 },
  { page: "/docs/getting-started", views: 7156, uniques: 5890, bounceRate: 22.4, avgTime: "5m 18s", trend: -3.2, sparkline: [7800, 7600, 7400, 7200, 7100, 7200, 7156], status: "warning", convRate: 88 },
  { page: "/dashboard", views: 6823, uniques: 4210, bounceRate: 15.8, avgTime: "8m 42s", trend: 5.7, sparkline: [5900, 6100, 6300, 6500, 6600, 6700, 6823], status: "healthy", convRate: 92 },
  { page: "/signup", views: 5491, uniques: 5102, bounceRate: 52.3, avgTime: "1m 15s", trend: -8.4, sparkline: [6800, 6400, 6100, 5800, 5600, 5500, 5491], status: "critical", convRate: 31 },
  { page: "/integrations", views: 4872, uniques: 3941, bounceRate: 35.6, avgTime: "2m 58s", trend: 15.2, sparkline: [3100, 3400, 3800, 4100, 4400, 4700, 4872], status: "healthy", convRate: 55 },
  { page: "/changelog", views: 3654, uniques: 2890, bounceRate: 41.2, avgTime: "2m 22s", trend: 31.0, sparkline: [1800, 2100, 2400, 2700, 3000, 3300, 3654], status: "healthy", convRate: 38 },
];

export const kpiSparklines = {
  revenue: [42, 45, 48, 51, 49, 55, 58, 62, 59, 65, 71, 78],
  users: [1.2, 1.3, 1.5, 1.4, 1.6, 1.8, 2.1, 2.3, 2.1, 2.5, 2.8, 3.2],
  conversion: [3.2, 3.1, 3.4, 3.3, 3.5, 3.6, 3.4, 3.7, 3.8, 3.9, 4.0, 4.2],
  arpu: [34, 35, 34, 36, 37, 36, 38, 39, 38, 40, 41, 42],
};
