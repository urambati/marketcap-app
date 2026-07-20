const BASE_URL = "https://finnhub.io/api/v1";

async function finnhubFetch(path: string, params: Record<string, string>) {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("token", process.env.FINNHUB_API_KEY!);

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`Finnhub request failed: ${res.status}`);
  }
  return res.json();
}

export function getQuote(symbol: string) {
  return finnhubFetch("/quote", { symbol });
}

export function getProfile(symbol: string) {
  return finnhubFetch("/stock/profile2", { symbol });
}

export function searchSymbols(query: string) {
  return finnhubFetch("/search", { q: query });
}

export function getCompanyNews(symbol: string, from: string, to: string) {
  return finnhubFetch("/company-news", { symbol, from, to });
}

export function getMarketNews() {
  return finnhubFetch("/news", { category: "general" });
}

export function getEarningsCalendar(from: string, to: string) {
  return finnhubFetch("/calendar/earnings", { from, to });
}
