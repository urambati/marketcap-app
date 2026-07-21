import Link from "next/link";
import EarningsCalendar from "@/components/EarningsCalendar";
import IndexCard from "@/components/IndexCard";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsList from "@/components/NewsList";
import SearchBar from "@/components/SearchBar";
import SectorRow from "@/components/SectorRow";
import { getEarningsCalendar, getMarketNews, getQuote } from "@/lib/finnhub";
import { INDICES } from "@/lib/indices";
import { buildMarketSummary } from "@/lib/marketSummary";
import { SECTORS } from "@/lib/sectors";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

type Quote = { c?: number; d?: number; dp?: number };

async function safeQuote(symbol: string): Promise<Quote | null> {
  try {
    return await getQuote(symbol);
  } catch {
    return null;
  }
}

export default async function Home() {
  const today = new Date();
  const weekOut = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [indexQuotes, sectorQuotes, news, earnings] = await Promise.all([
    Promise.all(INDICES.map((i) => safeQuote(i.symbol))),
    Promise.all(SECTORS.map((s) => safeQuote(s.symbol))),
    getMarketNews().catch(() => []),
    getEarningsCalendar(isoDate(today), isoDate(weekOut)).catch(() => ({
      earningsCalendar: [],
    })),
  ]);

  const summary = buildMarketSummary(
    INDICES.map((idx, i) => ({ name: idx.name, quote: indexQuotes[i] }))
  );

  const upcomingEarnings = (earnings.earningsCalendar ?? [])
    .filter((e: { epsEstimate?: number | null }) => e.epsEstimate != null)
    .sort((a: { date: string }, b: { date: string }) =>
      a.date.localeCompare(b.date)
    )
    .slice(0, 10);

  return (
    <>
      <MarketingHeader />
      <main>
        <section className="hero-shell">
          <span className="eyebrow">Live market intelligence</span>
          <h1 className="hero-title">Build conviction.<br /><span>Invest with clarity.</span></h1>
          <p className="hero-copy">Follow the market, organize your watchlist, and understand your portfolio from one beautifully focused workspace.</p>
          <div className="mx-auto mt-8 max-w-xl"><SearchBar /></div>
          <div className="hero-actions">
            <Link href="/dashboard" className="button button-primary">Open your portfolio</Link>
            <Link href="/pricing" className="button button-ghost">View pricing</Link>
          </div>
        </section>

      <div className="content-shell flex flex-col gap-10">

      <section id="markets">
        <div className="section-heading"><div><p>Market pulse</p><h2>US markets</h2></div><p>ETF proxy data · delayed</p></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {INDICES.map((idx, i) => (
            <IndexCard key={idx.symbol} name={idx.name} quote={indexQuotes[i]} />
          ))}
        </div>
      </section>

      <section className="premium-card relative overflow-hidden p-6">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-cyan-500" />
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-500">Today at a glance</p>
        <h2 className="mb-2 text-xl font-semibold">Market summary</h2>
        <p className="muted max-w-3xl text-sm leading-6">{summary}</p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="premium-card p-5">
          <h2 className="mb-2 text-lg font-semibold">Sector Performance</h2>
          <div className="flex flex-col">
            {SECTORS.map((s, i) => (
              <SectorRow key={s.symbol} name={s.name} quote={sectorQuotes[i]} />
            ))}
          </div>
        </section>

        <section className="premium-card p-5">
          <h2 className="mb-2 text-lg font-semibold">Market News</h2>
          <NewsList items={news} />
        </section>
      </div>

      <section className="premium-card p-5">
        <h2 className="mb-2 text-lg font-semibold">Upcoming Earnings</h2>
        <EarningsCalendar items={upcomingEarnings} />
      </section>
      </div>
      </main>
      <SiteFooter />
    </>
  );
}
