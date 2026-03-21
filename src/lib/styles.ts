/** Shared card surface classes — variant-aware via CSS variables. */
export const CARD_CLASSES =
  "mu-container rounded-[var(--mu-card-radius)] border-[length:var(--mu-card-border-w)] border-[color:var(--mu-card-border)] bg-[var(--mu-card-bg)] shadow-[var(--mu-card-shadow)]";

/** Shared hover interaction classes — customizable via --mu-hover-shadow / --mu-hover-border. */
export const HOVER_CLASSES =
  "hover:shadow-[var(--mu-hover-shadow)] hover:border-[color:var(--mu-hover-border)]";
