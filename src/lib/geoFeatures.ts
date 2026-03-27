/**
 * Pre-bundled GeoJSON features for the Choropleth component.
 *
 * Feature IDs are ISO 3166-1 alpha-3 codes (e.g. "USA", "GBR", "HND").
 *
 * @example
 * ```tsx
 * import { Choropleth, worldFeatures } from "metricui";
 *
 * <Choropleth
 *   data={[{ id: "USA", value: 340_000_000 }, { id: "GBR", value: 67_000_000 }]}
 *   features={worldFeatures}
 * />
 * ```
 */

import worldTopo from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { numericToAlpha3 } from "i18n-iso-countries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawFeatures: any[] = (
  feature(worldTopo as unknown as Topology, (worldTopo as any).objects.countries) as any
).features;

/**
 * World country boundaries as GeoJSON features.
 * 110m resolution (~105KB) — suitable for dashboard use.
 * Feature IDs are ISO 3166-1 alpha-3 codes: USA, GBR, DEU, FRA, JPN, CHN, IND, BRA, AUS, etc.
 */
export const worldFeatures = rawFeatures.map((f) => ({
  ...f,
  id: (f.id != null ? numericToAlpha3(f.id) : undefined) ?? f.id ?? f.properties?.name ?? "unknown",
}));

// ---------------------------------------------------------------------------
// US States (10m resolution, ~1.5MB)
// ---------------------------------------------------------------------------

import usTopo from "us-atlas/states-10m.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawUsFeatures: any[] = (
  feature(usTopo as unknown as Topology, (usTopo as any).objects.states) as any
).features;

/** FIPS code → standard 2-letter state abbreviation */
const FIPS_TO_ABBR: Record<string, string> = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE",
  "11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA",
  "20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN",
  "28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM",
  "36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI",
  "45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA",
  "54":"WV","55":"WI","56":"WY","60":"AS","66":"GU","69":"MP","72":"PR","78":"VI",
};

/**
 * US state boundaries as GeoJSON features.
 * 10m resolution — includes 50 states, DC, and territories.
 * Feature IDs are standard 2-letter abbreviations: CA, NY, TX, FL, etc.
 *
 * @example
 * ```tsx
 * import { Choropleth, usStatesFeatures } from "metricui";
 *
 * <Choropleth
 *   data={[{ id: "CA", value: 39_500_000 }, { id: "TX", value: 30_000_000 }]}
 *   features={usStatesFeatures}
 *   projectionType="naturalEarth1"
 *   projectionScale={500}
 *   projectionTranslation={[0.5, 0.6]}
 * />
 * ```
 */
export const usStatesFeatures = rawUsFeatures.map((f) => ({
  ...f,
  id: FIPS_TO_ABBR[f.id] ?? f.id,
}));
