type Quote = { c?: number; dp?: number } | null;

export function buildMarketSummary(
  indices: { name: string; quote: Quote }[]
): string {
  const valid = indices.filter(
    (i) => i.quote && typeof i.quote.dp === "number"
  ) as { name: string; quote: { dp: number } }[];

  if (valid.length === 0) {
    return "Market data is temporarily unavailable.";
  }

  const avgChange =
    valid.reduce((sum, i) => sum + i.quote.dp, 0) / valid.length;
  const direction =
    avgChange > 0.15 ? "higher" : avgChange < -0.15 ? "lower" : "little changed";

  const mover = [...valid].sort(
    (a, b) => Math.abs(b.quote.dp) - Math.abs(a.quote.dp)
  )[0];
  const moverDirection = mover.quote.dp >= 0 ? "gained" : "fell";

  return `US markets are trading ${direction} today, averaging ${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}% across major indices. ${mover.name} ${moverDirection} the most, moving ${mover.quote.dp >= 0 ? "+" : ""}${mover.quote.dp.toFixed(2)}%.`;
}
