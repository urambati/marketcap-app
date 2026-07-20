// Finnhub's free tier requires a paid subscription for raw index symbols
// (e.g. ^GSPC), so these liquid ETFs are used as close proxies instead.
export const INDICES = [
  { name: "Dow Jones", symbol: "DIA" },
  { name: "S&P 500", symbol: "SPY" },
  { name: "Nasdaq", symbol: "QQQ" },
  { name: "Russell 2000", symbol: "IWM" },
  { name: "VIX", symbol: "VIXY" },
] as const;
