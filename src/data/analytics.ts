// Google Analytics-style data for a fictional SaaS marketing site
// Generated with realistic patterns: weekday/weekend cycles, growth trends, seasonal dips

// ---------------------------------------------------------------------------
// Seeded PRNG for deterministic data
// ---------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42424242);
function between(min: number, max: number) { return Math.round(min + rand() * (max - min)); }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const START = new Date("2025-10-01");
const END = new Date("2025-12-31");
const DAYS: string[] = [];
for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
  DAYS.push(d.toISOString().slice(0, 10));
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

// ---------------------------------------------------------------------------
// Daily metrics (90 days)
// ---------------------------------------------------------------------------

export interface DailyMetric {
  date: string;
  device: "Desktop" | "Mobile" | "Tablet";
  sessions: number;
  pageViews: number;
  users: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number; // seconds
  conversions: number;
  conversionRate: number;
  revenue: number;
}

// Generate per-device rows: each day has 3 rows (Desktop, Mobile, Tablet)
const DEVICE_SPLITS: { device: DailyMetric["device"]; sessionShare: number; bounceAdj: number; convAdj: number }[] = [
  { device: "Desktop", sessionShare: 0.58, bounceAdj: -6, convAdj: 1.4 },
  { device: "Mobile", sessionShare: 0.36, bounceAdj: 10, convAdj: 0.5 },
  { device: "Tablet", sessionShare: 0.06, bounceAdj: 2, convAdj: 0.8 },
];

export const dailyMetrics: DailyMetric[] = DAYS.flatMap((date, i) => {
  const trend = 1 + i * 0.003;
  const weekendDip = isWeekend(date) ? 0.6 : 1;
  const holidayDip = date >= "2025-12-23" && date <= "2025-12-26" ? 0.4 : 1;
  const base = Math.round(2200 * trend * weekendDip * holidayDip);
  const totalSessions = base + between(-200, 200);

  return DEVICE_SPLITS.map(({ device, sessionShare, bounceAdj, convAdj }) => {
    const sessions = Math.round(totalSessions * sessionShare + between(-20, 20));
    const users = Math.round(sessions * (0.72 + rand() * 0.08));
    const newUsers = Math.round(users * (0.55 + rand() * 0.15));
    const pageViews = Math.round(sessions * (2.8 + rand() * 1.2));
    const bounceRate = Math.round(Math.max(10, Math.min(80, 38 + rand() * 18 + bounceAdj)) * 10) / 10;
    const avgSessionDuration = Math.round((120 + rand() * 180) * (device === "Mobile" ? 0.7 : 1));
    const baseConvRate = 0.028 + rand() * 0.015;
    const conversions = Math.round(sessions * baseConvRate * convAdj);
    const conversionRate = sessions > 0 ? Math.round((conversions / sessions) * 1000) / 10 : 0;
    const revenue = Math.round(conversions * (45 + rand() * 35));

    return { date, device, sessions, pageViews, users, newUsers, bounceRate, avgSessionDuration, conversions, conversionRate, revenue };
  });
});

// ---------------------------------------------------------------------------
// Traffic sources
// ---------------------------------------------------------------------------

export interface TrafficSource {
  source: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
  conversions: number;
  revenue: number;
}

export const trafficSources: TrafficSource[] = [
  { source: "Organic Search", sessions: 82400, users: 61200, newUsers: 38400, bounceRate: 35.2, conversions: 2890, revenue: 198600 },
  { source: "Direct", sessions: 41200, users: 28900, newUsers: 12100, bounceRate: 42.8, conversions: 1640, revenue: 112400 },
  { source: "Social", sessions: 28600, users: 24100, newUsers: 19800, bounceRate: 52.1, conversions: 680, revenue: 41200 },
  { source: "Referral", sessions: 19400, users: 15200, newUsers: 11400, bounceRate: 38.9, conversions: 890, revenue: 62100 },
  { source: "Email", sessions: 15800, users: 11400, newUsers: 3200, bounceRate: 28.4, conversions: 1120, revenue: 89200 },
  { source: "Paid Search", sessions: 12200, users: 10800, newUsers: 9600, bounceRate: 44.6, conversions: 520, revenue: 35800 },
  { source: "Display", sessions: 4800, users: 4200, newUsers: 3800, bounceRate: 61.2, conversions: 120, revenue: 7400 },
];

// ---------------------------------------------------------------------------
// Top pages
// ---------------------------------------------------------------------------

export interface PageMetric {
  page: string;
  pageViews: number;
  uniqueViews: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number;
  exitRate: number;
  conversions: number;
}

export const topPages: PageMetric[] = [
  { page: "/", pageViews: 89200, uniqueViews: 64100, avgTimeOnPage: 45, bounceRate: 38.2, exitRate: 22.1, conversions: 1240 },
  { page: "/pricing", pageViews: 42100, uniqueViews: 31200, avgTimeOnPage: 128, bounceRate: 18.4, exitRate: 35.2, conversions: 2180 },
  { page: "/features", pageViews: 38400, uniqueViews: 28900, avgTimeOnPage: 95, bounceRate: 24.1, exitRate: 18.8, conversions: 890 },
  { page: "/docs/getting-started", pageViews: 31200, uniqueViews: 22400, avgTimeOnPage: 245, bounceRate: 15.2, exitRate: 12.4, conversions: 420 },
  { page: "/blog/launch-announcement", pageViews: 24800, uniqueViews: 21200, avgTimeOnPage: 180, bounceRate: 42.8, exitRate: 48.2, conversions: 310 },
  { page: "/demo", pageViews: 18900, uniqueViews: 14200, avgTimeOnPage: 210, bounceRate: 12.1, exitRate: 28.4, conversions: 1640 },
  { page: "/docs/api-reference", pageViews: 16400, uniqueViews: 11800, avgTimeOnPage: 320, bounceRate: 8.9, exitRate: 15.1, conversions: 180 },
  { page: "/about", pageViews: 12100, uniqueViews: 9400, avgTimeOnPage: 62, bounceRate: 48.2, exitRate: 42.1, conversions: 45 },
  { page: "/blog/best-practices", pageViews: 9800, uniqueViews: 8200, avgTimeOnPage: 195, bounceRate: 35.4, exitRate: 38.9, conversions: 120 },
  { page: "/changelog", pageViews: 8400, uniqueViews: 6100, avgTimeOnPage: 85, bounceRate: 22.8, exitRate: 32.4, conversions: 65 },
  { page: "/integrations", pageViews: 7200, uniqueViews: 5800, avgTimeOnPage: 110, bounceRate: 28.4, exitRate: 24.2, conversions: 280 },
  { page: "/contact", pageViews: 5400, uniqueViews: 4200, avgTimeOnPage: 72, bounceRate: 32.1, exitRate: 55.8, conversions: 380 },
];

// ---------------------------------------------------------------------------
// Device & browser breakdown
// ---------------------------------------------------------------------------

export interface DeviceBreakdown {
  device: string;
  sessions: number;
  bounceRate: number;
  conversionRate: number;
}

export const devices: DeviceBreakdown[] = [
  { device: "Desktop", sessions: 118400, bounceRate: 32.4, conversionRate: 4.2 },
  { device: "Mobile", sessions: 72800, bounceRate: 48.9, conversionRate: 1.8 },
  { device: "Tablet", sessions: 13200, bounceRate: 41.2, conversionRate: 2.9 },
];

export interface BrowserBreakdown {
  browser: string;
  sessions: number;
}

export const browsers: BrowserBreakdown[] = [
  { browser: "Chrome", sessions: 108200 },
  { browser: "Safari", sessions: 42800 },
  { browser: "Firefox", sessions: 28400 },
  { browser: "Edge", sessions: 18600 },
  { browser: "Other", sessions: 6400 },
];

// ---------------------------------------------------------------------------
// Country breakdown
// ---------------------------------------------------------------------------

export interface CountryMetric {
  country: string;
  sessions: number;
  users: number;
  conversions: number;
  revenue: number;
}

export const countries: CountryMetric[] = [
  { country: "United States", sessions: 82400, users: 61200, conversions: 3240, revenue: 228400 },
  { country: "United Kingdom", sessions: 24600, users: 18400, conversions: 860, revenue: 58200 },
  { country: "Germany", sessions: 18200, users: 13800, conversions: 620, revenue: 42800 },
  { country: "Canada", sessions: 14800, users: 11200, conversions: 540, revenue: 38400 },
  { country: "France", sessions: 12400, users: 9200, conversions: 380, revenue: 24600 },
  { country: "Australia", sessions: 10200, users: 7800, conversions: 320, revenue: 22400 },
  { country: "India", sessions: 9800, users: 8400, conversions: 180, revenue: 8200 },
  { country: "Netherlands", sessions: 7200, users: 5400, conversions: 240, revenue: 16800 },
  { country: "Japan", sessions: 6400, users: 4800, conversions: 210, revenue: 15200 },
  { country: "Brazil", sessions: 5200, users: 4200, conversions: 120, revenue: 7400 },
  { country: "Sweden", sessions: 4200, users: 3200, conversions: 110, revenue: 8200 },
  { country: "Spain", sessions: 3800, users: 2900, conversions: 80, revenue: 5400 },
];

// ---------------------------------------------------------------------------
// Conversion funnel
// ---------------------------------------------------------------------------

export const conversionFunnel = [
  { id: "Visitors", label: "Site Visitors", value: 204400 },
  { id: "Engaged", label: "Engaged (>30s)", value: 128800 },
  { id: "Pricing", label: "Viewed Pricing", value: 42100 },
  { id: "Signup", label: "Started Signup", value: 12400 },
  { id: "Converted", label: "Completed Signup", value: 7860 },
  { id: "Paid", label: "First Payment", value: 3420 },
];

// ---------------------------------------------------------------------------
// Aggregated totals (for the period)
// ---------------------------------------------------------------------------

export const totals = {
  sessions: dailyMetrics.reduce((s, d) => s + d.sessions, 0),
  pageViews: dailyMetrics.reduce((s, d) => s + d.pageViews, 0),
  users: dailyMetrics.reduce((s, d) => s + d.users, 0),
  newUsers: dailyMetrics.reduce((s, d) => s + d.newUsers, 0),
  conversions: dailyMetrics.reduce((s, d) => s + d.conversions, 0),
  revenue: dailyMetrics.reduce((s, d) => s + d.revenue, 0),
  avgBounceRate: Math.round(dailyMetrics.reduce((s, d) => s + d.bounceRate, 0) / dailyMetrics.length * 10) / 10,
  avgSessionDuration: Math.round(dailyMetrics.reduce((s, d) => s + d.avgSessionDuration, 0) / dailyMetrics.length),
  avgConversionRate: Math.round(dailyMetrics.reduce((s, d) => s + d.conversionRate, 0) / dailyMetrics.length * 10) / 10,
};
