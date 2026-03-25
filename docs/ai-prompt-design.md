# MetricUI AI Layer — Prompt Design

## System Prompt (shared across all dashboards)

```
You are a senior data analyst reviewing a live dashboard. Your job is to find what the human would MISS by scanning the charts themselves.

RULES:
1. NEVER restate numbers visible on the dashboard. The user can see "Revenue: $142K" — don't tell them.
2. Focus on TENSIONS between metrics — when two things should move together but don't.
3. Surface HIDDEN PATTERNS — things buried in aggregations, ratios between dimensions, trailing trends.
4. Be SPECIFIC — cite exact numbers, name exact dimensions. "Some sources perform better" is worthless. "Email converts at 7.1% vs Social's 2.4% despite having 45% fewer sessions" is useful.
5. Be CONCISE — 2-3 insights max. Each one sentence with supporting evidence.
6. NEVER give generic advice like "consider improving" or "you should investigate." State what the data shows, not what to do about it.
```

---

## Per-Dashboard Context Templates

### Web Analytics (GA-style)

```
DASHBOARD: Website Analytics — {siteName}
PERIOD: {periodStart} – {periodEnd}
{comparisonNote}

AGGREGATE:
Sessions: {sessions} | Users: {users} ({newUserPct}% new) | Bounce: {bounceRate}%
Conversion Rate: {convRate}% | Revenue: {revenue}

BY SOURCE:
{sources.map(s => `${s.source}: ${s.sessions} sess, ${s.convRate}% conv, ${s.revenue} rev, ${s.bounceRate}% bounce`)}

BY DEVICE:
{devices.map(d => `${d.device}: ${d.sessions} sess, ${d.bounceRate}% bounce, ${d.convRate}% conv`)}

TOP CONVERTING PAGES:
{topPages.slice(0,5).map(p => `${p.page}: ${p.conversions} conv, ${p.bounceRate}% bounce, ${p.avgTime}s avg time`)}

FUNNEL:
{funnel.map(s => `${s.label}: ${s.value}`).join(' → ')}
Drop-offs: {funnel dropoff percentages between each step}

{userContext}
```

**What this prompt surfaces well:**
- Channel efficiency mismatches (high traffic / low conversion)
- Device experience gaps (mobile vs desktop conversion delta)
- Funnel bottleneck identification (which step loses the most)
- Page-level anomalies (high traffic + high bounce = content mismatch)

**Example good output:**
> Email converts at 7.1% — nearly 3x your average — but receives only 8% of traffic. Each Email session generates $5.65 in revenue vs $0.60 for Social. The 9x revenue-per-session gap suggests Email is dramatically under-scaled relative to its performance.

> 67% of engaged visitors (those spending 30+ seconds) never reach the pricing page. Your homepage gets 89K views but has a 38% bounce rate — meaning 34K visitors leave from the front door. The /demo page converts at 8.7% with only 12% bounce, but gets less than a quarter of homepage traffic. The highest-converting content is the hardest to find.

> Mobile makes up 36% of sessions but only 18% of conversions. The conversion rate gap (1.8% vs 4.2% desktop) is wider than the bounce rate gap would predict — mobile visitors who don't bounce still aren't converting. This points to a checkout/signup flow issue on mobile, not a content relevance problem.

---

### SaaS Metrics

```
DASHBOARD: SaaS Metrics — {companyName}
PERIOD: {periodStart} – {periodEnd}
{comparisonNote}

AGGREGATE:
MRR: {mrr} | ARR: {arr} | Active Accounts: {active} | Churn Rate: {churnRate}%
Avg MRR/Account: {avgMrr} | Total Seats: {seats}

BY PLAN:
{plans.map(p => `${p.plan}: ${p.count} accounts, ${p.mrr} MRR, ${p.avgMrr} avg, ${p.churnRate}% churn`)}

BY INDUSTRY:
{industries.map(i => `${i.name}: ${i.count} accounts, ${i.mrr} MRR, ${i.churnRate}% churn`)}

BY COUNTRY:
{countries.map(c => `${c.country}: ${c.count} accounts, ${c.mrr} MRR`)}

CHURN REASONS (churned accounts):
{reasons.map(r => `${r.reason}: ${r.count} (${r.pct}%)`)}

GROWTH:
{monthly signups and churns for the period}

{userContext}
```

**Example good output:**
> Enterprise accounts are 14% of your base but 52% of MRR. Your average Enterprise MRR ($68K) is 8.5x your Pro average ($8K) — but Enterprise churn, even at a low rate, has outsized revenue impact. One churned Enterprise account erases 8 Pro wins.

> FinTech has 23% higher churn than your next worst industry (EdTech), but it's also your highest MRR-per-account segment. The churn reasons skew heavily toward "competitor" (41%) vs the overall average of 22%. You're losing your most valuable accounts to competitive pressure, not product issues.

> Your join cohort curve shows a retention cliff at month 4 — accounts that survive 4 months have 89% 12-month retention. But 31% of accounts churn before month 4. The onboarding window, not the product, is the leak.

---

### GitHub Repository

```
DASHBOARD: Repository Analytics — {repoName}
PERIOD: {periodStart} – {periodEnd}

REPO:
Stars: {stars} | Forks: {forks} | Open Issues: {openIssues} | Watchers: {watchers}
Fork-to-Star Ratio: {forkStarRatio}%

COMMIT ACTIVITY ({weekCount} weeks):
Total Commits: {totalCommits} | Avg/Week: {avgPerWeek}
Peak Week: {peakWeek} ({peakCommits}) | Lowest: {lowWeek} ({lowCommits})

BY DAY OF WEEK:
{days.map(d => `${d.day}: ${d.commits} commits`)}

ISSUES (period):
Open: {openCount} | Closed: {closedCount}
Top labels: {labels.map(l => `${l.name}: ${l.count}`)}

PULL REQUESTS (period):
Open: {prOpen} | Merged: {prMerged} | Closed: {prClosed}

LANGUAGES:
{languages.map(l => `${l.name}: ${l.pct}%`)}

{userContext}
```

**Example good output:**
> The fork-to-star ratio (20.8%) is unusually high for a library project — most sit between 5-15%. This suggests active downstream development: people aren't just bookmarking React, they're building on it. Combined with 6,670 watchers (2.7% of stargazers), the engaged community is proportionally large.

> Commit velocity is heavily concentrated mid-week: Tuesday through Thursday account for 64% of all commits, with near-zero weekend activity. This is a team-driven project, not community-driven — contribution patterns match a corporate engineering schedule, not open-source hobby patterns.

> The issue label distribution shows "Status: Unconfirmed" at 42% — nearly half of open issues haven't been triaged. With 1,186 open issues and a close rate of only 12 per week at current velocity, the backlog would take 2+ years to clear. The maintenance burden is growing faster than the team can address it.

---

### Wikipedia Streaming

```
DASHBOARD: Wikipedia Live Edits — Real-time stream
WINDOW: Last {duration}

AGGREGATE:
Total Edits: {total} | Edit Rate: {rate}/sec | Unique Editors: {editors}
Bot Ratio: {botPct}% | Human Ratio: {humanPct}%

BY WIKI:
{topWikis.map(w => `${w.name}: ${w.edits} edits (${w.pct}%)`)}

BY TYPE:
{types.map(t => `${t.type}: ${t.count} (${t.pct}%)`)}

VELOCITY (last 60s):
Human rate: {humanRate}/sec | Bot rate: {botRate}/sec
{trend: accelerating, steady, or decelerating}

{userContext}
```

**Example good output:**
> Wikidata and Commons together account for 62% of all edits but are almost entirely bot-driven (94% bot rate). Excluding these two wikis, the human edit rate across language Wikipedias is actually 4.2/sec — significantly higher than the blended 2.1/sec the headline suggests. The aggregate bot ratio masks a much more active human editing community.

> English Wikipedia is only the 3rd most active wiki by edit volume, behind Wikidata and Commons. But it has the highest human-to-bot ratio (78% human) of any top-10 wiki. The "most edited" and "most human-edited" wikis are completely different populations.

---

### World Explorer

```
DASHBOARD: World Data Explorer
FILTERS: {activeRegion}, {activeSubregion}

VIEWING:
{countries.length} countries | Region: {region}

METRICS:
Population: {totalPop} | Avg GDP/capita: {avgGdp}
Languages: {langCount} | Currencies: {currCount}

TOP BY POPULATION:
{top5.map(c => `${c.name}: ${c.pop}, GDP/cap ${c.gdp}`)}

{userContext}
```

**Example good output:**
> The GDP-population inversion in this region is extreme: the top 3 countries by population have an average GDP/capita of $4,200, while the bottom 3 have $48,600. Population size and economic output are inversely correlated here — the smallest countries are the wealthiest per person by a factor of 11x.

---

## Prompt Customization API

Devs can customize at three levels:

### Level 1: Tone presets
```tsx
<DashboardInsight tone="executive" />    // high-level, action-oriented
<DashboardInsight tone="technical" />    // detailed, metric-heavy
<DashboardInsight tone="narrative" />    // storytelling, contextual
```

### Level 2: Custom system prompt addition
```tsx
<DashboardInsight
  context="This is a B2B SaaS company selling to mid-market.
           Our Q4 revenue target is $500K. We just raised Series A."
/>
```
This gets appended to the system prompt as `USER CONTEXT:` — gives the LLM business background without overriding the analysis framework.

### Level 3: Full prompt override
```tsx
<DashboardInsight
  buildPrompt={(dashboardData) => {
    // Dev has full control over the prompt
    return `Analyze this data for ${myCompany}: ${JSON.stringify(dashboardData)}`;
  }}
/>
```

### Level 4: Post-processing
```tsx
<DashboardInsight
  transform={(response) => {
    // Filter, reformat, or augment the LLM response
    return response.split('\n').filter(line => line.includes('revenue'));
  }}
/>
```

---

## What the component auto-collects

The DashboardInsight component automatically gathers from context:
- Active period from FilterContext (date range, preset name)
- Comparison period data if active
- All dimension filters (industry, country, device, etc.)
- Cross-filter selection
- KPI values from all visible KpiCards (via a data registry context)
- Chart data summaries (top N values, totals, trends)

The dev writes zero data-gathering code. The component reads the dashboard state and builds the prompt.

---

## Open questions

1. **How do we collect KPI/chart values?** Components would need to register their data with a context. New concept: `<AiContextProvider>` that child components report into.
2. **Token cost visibility** — should we show estimated token count before sending? "This analysis will use ~2K tokens."
3. **Caching** — same dashboard state = same prompt = cache the response? Saves the dev money.
4. **Streaming UX** — token-by-token rendering with a typing indicator? Or wait for complete response?
5. **Error states** — rate limits, API key issues, model errors. Need graceful degradation.
6. **Refresh trigger** — auto-refresh when filters change? Or manual "Refresh analysis" button?
