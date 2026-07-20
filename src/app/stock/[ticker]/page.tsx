import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import { getCompanyNews, getProfile, getQuote } from "@/lib/finnhub";
import { getDailyCandles } from "@/lib/alphavantage";
import { createClient } from "@/lib/supabase/server";
import { addHolding } from "../../portfolio/actions";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  const to = isoDate(new Date());
  const from = isoDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [quote, profile, candlesData, news] = await Promise.all([
    getQuote(symbol),
    getProfile(symbol),
    getDailyCandles(symbol),
    getCompanyNews(symbol, from, to),
  ]);

  const change = quote.d ?? 0;
  const changePct = quote.dp ?? 0;
  const isUp = change >= 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm underline">
        ← Back to search
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {profile.name ?? symbol} ({symbol})
          </h1>
          <p className="text-sm text-gray-600">{profile.exchange}</p>
        </div>

        {user ? (
          <form action={addHolding}>
            <input type="hidden" name="ticker" value={symbol} />
            <button
              type="submit"
              className="rounded bg-black px-3 py-2 text-sm text-white"
            >
              Add to portfolio
            </button>
          </form>
        ) : (
          <Link href="/login" className="text-sm underline">
            Log in to add to portfolio
          </Link>
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-3xl font-semibold">
          ${quote.c?.toFixed(2)}
        </span>
        <span className={isUp ? "text-green-600" : "text-red-600"}>
          {isUp ? "+" : ""}
          {change.toFixed(2)} ({changePct.toFixed(2)}%)
        </span>
      </div>

      <div className="mt-8">
        <PriceChart candles={candlesData.candles} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <Stat label="Market Cap" value={formatMarketCap(profile.marketCapitalization)} />
        <Stat label="Day High" value={quote.h?.toFixed(2)} />
        <Stat label="Day Low" value={quote.l?.toFixed(2)} />
        <Stat label="Open" value={quote.o?.toFixed(2)} />
        <Stat label="Prev Close" value={quote.pc?.toFixed(2)} />
        <Stat label="Industry" value={profile.finnhubIndustry} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Recent News</h2>
        <ul className="flex flex-col gap-3">
          {news.slice(0, 8).map((item: { id: number; url: string; headline: string; source: string }) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                {item.headline}
              </a>
              <span className="ml-2 text-xs text-gray-500">
                {item.source}
              </span>
            </li>
          ))}
          {news.length === 0 && (
            <p className="text-sm text-gray-500">No recent news found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded border px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value ?? "—"}</div>
    </div>
  );
}

function formatMarketCap(capInMillions?: number) {
  if (!capInMillions) return undefined;
  const billions = capInMillions / 1000;
  return `$${billions.toFixed(1)}B`;
}
