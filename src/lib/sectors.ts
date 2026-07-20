// Sector SPDR ETFs used as proxies for sector performance (free-tier friendly).
export const SECTORS = [
  { name: "Technology", symbol: "XLK" },
  { name: "Financials", symbol: "XLF" },
  { name: "Energy", symbol: "XLE" },
  { name: "Health Care", symbol: "XLV" },
  { name: "Industrials", symbol: "XLI" },
  { name: "Consumer Discretionary", symbol: "XLY" },
  { name: "Consumer Staples", symbol: "XLP" },
  { name: "Materials", symbol: "XLB" },
  { name: "Utilities", symbol: "XLU" },
  { name: "Real Estate", symbol: "XLRE" },
  { name: "Communication", symbol: "XLC" },
] as const;
