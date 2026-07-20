const BASE_URL = "https://www.alphavantage.co/query";

export async function getDailyCandles(symbol: string) {
  const url = new URL(BASE_URL);
  url.searchParams.set("function", "TIME_SERIES_DAILY");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("outputsize", "compact");
  url.searchParams.set("apikey", process.env.ALPHAVANTAGE_API_KEY!);

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Alpha Vantage request failed: ${res.status}`);
  }

  const data = await res.json();
  const series = data["Time Series (Daily)"];
  if (!series) {
    return { symbol, candles: [] };
  }

  const candles = Object.entries(series)
    .map(([date, values]) => {
      const v = values as Record<string, string>;
      return {
        date,
        open: Number(v["1. open"]),
        high: Number(v["2. high"]),
        low: Number(v["3. low"]),
        close: Number(v["4. close"]),
        volume: Number(v["5. volume"]),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return { symbol, candles };
}
