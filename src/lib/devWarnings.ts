const warned = new Set<string>();

export function devWarn(id: string, message: string): void {
  if (process.env.NODE_ENV !== "production" && !warned.has(id)) {
    warned.add(id);
    console.warn(`[MetricUI] ${message}`);
  }
}

export function devWarnDeprecated(component: string, oldProp: string, newProp: string): void {
  devWarn(
    `${component}.${oldProp}`,
    `<${component}> prop "${oldProp}" is deprecated. Use "${newProp}" instead.`
  );
}
