// Full account-level dataset for the SaaS demo.
// 500 accounts with dimensions for filtering: industry, plan, country, status, joinDate.
// Generated deterministically from a seed so the data is stable across renders.

const industries = ["DevTools", "FinTech", "Cybersecurity", "HealthTech", "EdTech"];
const plans = ["Basic", "Pro", "Enterprise"];
const countries = ["US", "US", "US", "US", "US", "US", "UK", "UK", "IN", "IN", "AU", "DE", "CA", "FR"]; // weighted toward US
const churnReasonOptions = ["features", "support", "budget", "competitor", "pricing", "unknown"];

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function between(min: number, max: number): number { return Math.floor(rand() * (max - min + 1)) + min; }

export interface Account {
  name: string;
  industry: string;
  plan: string;
  mrr: number;
  seats: number;
  country: string;
  status: "active" | "churned";
  churnReason?: string;
  joinMonth: string; // "YYYY-MM"
}

const months: string[] = [];
for (let y = 2023; y <= 2024; y++) {
  for (let m = 1; m <= 12; m++) {
    months.push(`${y}-${String(m).padStart(2, "0")}`);
  }
}

export const accounts: Account[] = Array.from({ length: 500 }, (_, i) => {
  const isChurned = rand() < 0.22; // ~22% churn rate
  const plan = pick(plans);
  const mrrBase = plan === "Enterprise" ? between(30000, 140000)
    : plan === "Pro" ? between(10000, 80000)
    : between(2000, 40000);
  const joinIdx = Math.floor(rand() * months.length);

  return {
    name: `Company_${i + 1}`,
    industry: pick(industries),
    plan,
    mrr: isChurned ? 0 : mrrBase,
    seats: between(50, 1500),
    country: pick(countries),
    status: isChurned ? "churned" as const : "active" as const,
    churnReason: isChurned ? pick(churnReasonOptions) : undefined,
    joinMonth: months[joinIdx],
  };
});

// Pre-computed derived datasets for convenience
export const activeAccounts = accounts.filter((a) => a.status === "active");
export const churnedAccounts = accounts.filter((a) => a.status === "churned");
