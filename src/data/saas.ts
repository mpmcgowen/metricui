// RavenStack SaaS Analytics — aggregated from Kaggle dataset
// Source: https://www.kaggle.com/datasets/rivalytics/saas-subscription-and-churn-analytics-dataset

export const kpis = {
  mrr: 10159608,
  arr: 121915296,
  activeAccounts: 390,
  churned: 110,
  totalAccounts: 500,
  avgMrr: 2250,
  totalSeats: 134758,
  upgrades: 529,
  downgrades: 218,
  churnRate: 22.0,
  prevMrr: 8940455,
  prevArr: 107285460,
  prevActiveAccounts: 362,
  prevChurnRate: 25.3,
};

export const mrrByMonth = [
  { month: "2023-01", mrr: 4684, newSubs: 3 },
  { month: "2023-02", mrr: 11079, newSubs: 11 },
  { month: "2023-03", mrr: 25885, newSubs: 17 },
  { month: "2023-04", mrr: 41788, newSubs: 31 },
  { month: "2023-05", mrr: 85919, newSubs: 29 },
  { month: "2023-06", mrr: 74987, newSubs: 46 },
  { month: "2023-07", mrr: 120422, newSubs: 59 },
  { month: "2023-08", mrr: 165621, newSubs: 82 },
  { month: "2023-09", mrr: 116222, newSubs: 62 },
  { month: "2023-10", mrr: 182518, newSubs: 84 },
  { month: "2023-11", mrr: 217219, newSubs: 121 },
  { month: "2023-12", mrr: 267264, newSubs: 121 },
  { month: "2024-01", mrr: 276933, newSubs: 134 },
  { month: "2024-02", mrr: 365442, newSubs: 152 },
  { month: "2024-03", mrr: 421916, newSubs: 186 },
  { month: "2024-04", mrr: 445858, newSubs: 193 },
  { month: "2024-05", mrr: 632549, newSubs: 245 },
  { month: "2024-06", mrr: 537758, newSubs: 248 },
  { month: "2024-07", mrr: 707816, newSubs: 330 },
  { month: "2024-08", mrr: 648426, newSubs: 337 },
  { month: "2024-09", mrr: 992366, newSubs: 440 },
  { month: "2024-10", mrr: 1173608, newSubs: 504 },
  { month: "2024-11", mrr: 1549040, newSubs: 612 },
  { month: "2024-12", mrr: 2273427, newSubs: 953 },
];

export const mrrSparkline = [276933, 365442, 421916, 445858, 632549, 537758, 707816, 648426, 992366, 1173608, 1549040, 2273427];

export const churnByMonth = [
  { month: "2023-01", churned: 1 },
  { month: "2023-03", churned: 5 },
  { month: "2023-04", churned: 3 },
  { month: "2023-05", churned: 3 },
  { month: "2023-06", churned: 5 },
  { month: "2023-07", churned: 6 },
  { month: "2023-08", churned: 7 },
  { month: "2023-09", churned: 6 },
  { month: "2023-10", churned: 10 },
  { month: "2023-11", churned: 11 },
  { month: "2023-12", churned: 16 },
  { month: "2024-01", churned: 20 },
  { month: "2024-02", churned: 10 },
  { month: "2024-03", churned: 24 },
  { month: "2024-04", churned: 25 },
  { month: "2024-05", churned: 27 },
  { month: "2024-06", churned: 40 },
  { month: "2024-07", churned: 35 },
  { month: "2024-08", churned: 42 },
  { month: "2024-09", churned: 53 },
  { month: "2024-10", churned: 66 },
  { month: "2024-11", churned: 68 },
  { month: "2024-12", churned: 117 },
];

export const planDistribution = [
  { id: "Pro", label: "Pro", value: 178 },
  { id: "Basic", label: "Basic", value: 168 },
  { id: "Enterprise", label: "Enterprise", value: 154 },
];

export const industryDistribution = [
  { id: "DevTools", label: "DevTools", value: 113 },
  { id: "FinTech", label: "FinTech", value: 112 },
  { id: "Cybersecurity", label: "Cybersecurity", value: 100 },
  { id: "HealthTech", label: "HealthTech", value: 96 },
  { id: "EdTech", label: "EdTech", value: 79 },
];

export const countryDistribution = [
  { country: "US", accounts: 291 },
  { country: "UK", accounts: 58 },
  { country: "IN", accounts: 49 },
  { country: "AU", accounts: 32 },
  { country: "DE", accounts: 25 },
  { country: "CA", accounts: 23 },
  { country: "FR", accounts: 22 },
];

export const churnReasons = [
  { id: "features", label: "Features", value: 114 },
  { id: "support", label: "Support", value: 104 },
  { id: "budget", label: "Budget", value: 104 },
  { id: "unknown", label: "Unknown", value: 95 },
  { id: "competitor", label: "Competitor", value: 92 },
  { id: "pricing", label: "Pricing", value: 91 },
];

export const referralSources = [
  { source: "organic", accounts: 114 },
  { source: "other", accounts: 103 },
  { source: "ads", accounts: 98 },
  { source: "event", accounts: 96 },
  { source: "partner", accounts: 89 },
];

export const topFeatures = [
  { feature: "Feature 32", usage: 6686 },
  { feature: "Feature 15", usage: 6621 },
  { feature: "Feature 6", usage: 6546 },
  { feature: "Feature 20", usage: 6541 },
  { feature: "Feature 34", usage: 6536 },
  { feature: "Feature 12", usage: 6534 },
  { feature: "Feature 11", usage: 6533 },
  { feature: "Feature 2", usage: 6525 },
  { feature: "Feature 38", usage: 6478 },
  { feature: "Feature 26", usage: 6470 },
  { feature: "Feature 17", usage: 6458 },
  { feature: "Feature 39", usage: 6430 },
  { feature: "Feature 31", usage: 6425 },
  { feature: "Feature 36", usage: 6389 },
  { feature: "Feature 24", usage: 6388 },
];

export const revenueWaterfall = [
  { label: "Starting MRR", value: 8940455 },
  { label: "New Business", value: 812768 },
  { label: "Expansion", value: 609576 },
  { label: "Contraction", value: -152394 },
  { label: "Churn", value: -253990 },
  { label: "Current MRR", type: "total" as const },
];

export const conversionFunnel = [
  { id: "signups", label: "Signed Up", value: 500 },
  { id: "activated", label: "Activated", value: 390 },
  { id: "subscribed", label: "Subscribed", value: 390 },
  { id: "retained", label: "Retained (6mo)", value: 319 },
];

export const okrScorecard = [
  { label: "MRR", value: 10159608, target: 11683549, max: 13207490 },
  { label: "Active Accounts", value: 390, target: 450, max: 500 },
  { label: "NPS Score", value: 72, target: 80, max: 100 },
  { label: "Churn Rate", value: 22.0, target: 15, max: 30 },
];

export const topAccounts = [
  { name: "Company_166", industry: "DevTools", plan: "Enterprise", mrr: 131911, seats: 1022, country: "US" },
  { name: "Company_403", industry: "FinTech", plan: "Pro", mrr: 114777, seats: 1053, country: "US" },
  { name: "Company_368", industry: "EdTech", plan: "Basic", mrr: 94710, seats: 1050, country: "AU" },
  { name: "Company_130", industry: "EdTech", plan: "Basic", mrr: 83886, seats: 744, country: "FR" },
  { name: "Company_23", industry: "EdTech", plan: "Enterprise", mrr: 75938, seats: 688, country: "IN" },
  { name: "Company_488", industry: "EdTech", plan: "Pro", mrr: 75776, seats: 1480, country: "US" },
  { name: "Company_480", industry: "EdTech", plan: "Basic", mrr: 70980, seats: 490, country: "US" },
  { name: "Company_337", industry: "Cybersecurity", plan: "Enterprise", mrr: 70644, seats: 870, country: "IN" },
  { name: "Company_341", industry: "FinTech", plan: "Basic", mrr: 70000, seats: 770, country: "AU" },
  { name: "Company_358", industry: "EdTech", plan: "Pro", mrr: 69687, seats: 1044, country: "FR" },
  { name: "Company_174", industry: "FinTech", plan: "Basic", mrr: 69230, seats: 840, country: "US" },
  { name: "Company_475", industry: "FinTech", plan: "Enterprise", mrr: 67737, seats: 670, country: "US" },
  { name: "Company_235", industry: "EdTech", plan: "Pro", mrr: 64400, seats: 1104, country: "US" },
  { name: "Company_157", industry: "DevTools", plan: "Pro", mrr: 62580, seats: 560, country: "US" },
  { name: "Company_198", industry: "EdTech", plan: "Basic", mrr: 60092, seats: 503, country: "US" },
  { name: "Company_402", industry: "Cybersecurity", plan: "Enterprise", mrr: 58291, seats: 485, country: "UK" },
  { name: "Company_203", industry: "DevTools", plan: "Enterprise", mrr: 55995, seats: 456, country: "US" },
  { name: "Company_177", industry: "EdTech", plan: "Pro", mrr: 54605, seats: 978, country: "UK" },
  { name: "Company_412", industry: "Cybersecurity", plan: "Enterprise", mrr: 52089, seats: 680, country: "FR" },
  { name: "Company_171", industry: "Cybersecurity", plan: "Enterprise", mrr: 51680, seats: 400, country: "AU" },
];

export const signupsByMonth = [
  { month: "2023-01", signups: 17 },
  { month: "2023-02", signups: 18 },
  { month: "2023-03", signups: 20 },
  { month: "2023-04", signups: 15 },
  { month: "2023-05", signups: 26 },
  { month: "2023-06", signups: 13 },
  { month: "2023-07", signups: 14 },
  { month: "2023-08", signups: 16 },
  { month: "2023-09", signups: 23 },
  { month: "2023-10", signups: 20 },
  { month: "2023-11", signups: 25 },
  { month: "2023-12", signups: 20 },
  { month: "2024-01", signups: 16 },
  { month: "2024-02", signups: 13 },
  { month: "2024-03", signups: 27 },
  { month: "2024-04", signups: 22 },
  { month: "2024-05", signups: 22 },
  { month: "2024-06", signups: 21 },
  { month: "2024-07", signups: 26 },
  { month: "2024-08", signups: 21 },
  { month: "2024-09", signups: 25 },
  { month: "2024-10", signups: 31 },
  { month: "2024-11", signups: 32 },
  { month: "2024-12", signups: 17 },
];
