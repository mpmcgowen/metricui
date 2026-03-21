/**
 * MetricUI MCP Server — Documentation Search Engine
 *
 * Weighted keyword search across all knowledge sources:
 * components, props, types, patterns, format examples, and guide content.
 */

import { COMPONENTS } from "./components.js";
import { TYPES } from "./types.js";
import { PATTERNS } from "./patterns.js";
import { FORMAT_EXAMPLES } from "./format-examples.js";
import {
  METRIC_CONFIG_DOCS,
  FORMAT_ENGINE_DOCS,
  THEMING_DOCS,
} from "./config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  type: "component" | "prop" | "type" | "pattern" | "guide" | "format";
  title: string;
  snippet: string;
  reference: string;
  score: number;
}

type ResultType = SearchResult["type"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\-_.,;:!?()[\]{}<>"'`/|\\]+/)
    .filter((w) => w.length >= 2);
}

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const w of words) {
    if (lower.includes(w)) count++;
  }
  return count;
}

function snippet(text: string, maxLen = 200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + "...";
}

// ---------------------------------------------------------------------------
// Guide sections (split config docs by headings)
// ---------------------------------------------------------------------------

interface GuideSection {
  source: string;
  heading: string;
  content: string;
}

function splitMarkdownSections(source: string, markdown: string): GuideSection[] {
  const sections: GuideSection[] = [];
  const lines = markdown.split("\n");
  let currentHeading = source;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      if (currentContent.length > 0) {
        sections.push({
          source,
          heading: currentHeading,
          content: currentContent.join("\n"),
        });
      }
      currentHeading = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 0) {
    sections.push({
      source,
      heading: currentHeading,
      content: currentContent.join("\n"),
    });
  }
  return sections;
}

const GUIDE_SECTIONS: GuideSection[] = [
  ...splitMarkdownSections("MetricProvider", METRIC_CONFIG_DOCS),
  ...splitMarkdownSections("Format Engine", FORMAT_ENGINE_DOCS),
  ...splitMarkdownSections("Theming", THEMING_DOCS),
];

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function searchDocs(
  query: string,
  limit = 10,
  typeFilter: ResultType | "all" = "all"
): SearchResult[] {
  const words = tokenize(query);
  if (words.length === 0) return [];

  const results: SearchResult[] = [];

  // --- Components ---
  if (typeFilter === "all" || typeFilter === "component") {
    for (const comp of COMPONENTS) {
      let score = 0;
      // Exact name match
      if (comp.name.toLowerCase() === query.toLowerCase()) score += 20;
      // Word in name
      score += countMatches(comp.name, words) * 10;
      // Word in description
      score += countMatches(comp.description, words) * 5;
      // Word in long description
      score += countMatches(comp.longDescription, words) * 3;
      // Word in category
      score += countMatches(comp.category, words) * 3;
      // Word in notes
      for (const note of comp.notes) {
        score += countMatches(note, words) * 1;
      }

      if (score > 0) {
        results.push({
          type: "component",
          title: comp.name,
          snippet: snippet(comp.description),
          reference: `component:${comp.name}`,
          score,
        });
      }
    }
  }

  // --- Props ---
  if (typeFilter === "all" || typeFilter === "prop") {
    for (const comp of COMPONENTS) {
      for (const prop of comp.props) {
        let score = 0;
        if (prop.name.toLowerCase() === query.toLowerCase()) score += 15;
        score += countMatches(prop.name, words) * 8;
        score += countMatches(prop.description, words) * 4;
        score += countMatches(prop.type, words) * 2;

        if (score > 0) {
          results.push({
            type: "prop",
            title: `${comp.name}.${prop.name}`,
            snippet: snippet(`${prop.type} — ${prop.description}`),
            reference: `prop:${comp.name}.${prop.name}`,
            score,
          });
        }
      }
    }
  }

  // --- Types ---
  if (typeFilter === "all" || typeFilter === "type") {
    for (const t of TYPES) {
      let score = 0;
      if (t.name.toLowerCase() === query.toLowerCase()) score += 20;
      score += countMatches(t.name, words) * 10;
      score += countMatches(t.description, words) * 5;
      score += countMatches(t.definition, words) * 2;

      if (score > 0) {
        results.push({
          type: "type",
          title: t.name,
          snippet: snippet(t.description),
          reference: `type:${t.name}`,
          score,
        });
      }
    }
  }

  // --- Patterns ---
  if (typeFilter === "all" || typeFilter === "pattern") {
    for (const p of PATTERNS) {
      let score = 0;
      if (p.name.toLowerCase() === query.toLowerCase()) score += 20;
      score += countMatches(p.name, words) * 10;
      score += countMatches(p.description, words) * 5;
      // Tags get a bonus
      for (const tag of p.tags) {
        score += countMatches(tag, words) * 4;
      }
      score += countMatches(p.code, words) * 1;

      if (score > 0) {
        results.push({
          type: "pattern",
          title: p.name,
          snippet: snippet(p.description),
          reference: `pattern:${p.slug}`,
          score,
        });
      }
    }
  }

  // --- Format examples ---
  if (typeFilter === "all" || typeFilter === "format") {
    for (const fe of FORMAT_EXAMPLES) {
      let score = 0;
      score += countMatches(fe.valueType, words) * 6;
      for (const kw of fe.keywords) {
        score += countMatches(kw, words) * 4;
      }

      if (score > 0) {
        results.push({
          type: "format",
          title: fe.valueType,
          snippet: `${fe.formatOption} → ${fe.example.input} renders as "${fe.example.output}"`,
          reference: `format:${fe.valueType}`,
          score,
        });
      }
    }
  }

  // --- Guide sections ---
  if (typeFilter === "all" || typeFilter === "guide") {
    for (const section of GUIDE_SECTIONS) {
      let score = 0;
      score += countMatches(section.heading, words) * 8;
      score += countMatches(section.content, words) * 2;

      if (score > 0) {
        results.push({
          type: "guide",
          title: `${section.source}: ${section.heading}`,
          snippet: snippet(section.content),
          reference: `guide:${section.source}#${section.heading}`,
          score,
        });
      }
    }
  }

  // Sort by score descending, truncate
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
