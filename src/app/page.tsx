import Link from "next/link";
import IndexCard from "@/components/IndexCard";
import SearchBar from "@/components/SearchBar";
import SectorRow from "@/components/SectorRow";
import { getQuote } from "@/lib/finnhub";
import { INDICES } from "@/lib/indices";
import { SECTORS } from "@/lib/sectors";

type Quote = { c?: number; d?: number; dp?: number };

async function safeQuote(symbol: string): Promise<Quote | null> {
  try {
    return await getQuote(symbol);
  } catch {
    return null;
  }
}

export default async function Home() {
  const [indexQuotes, sectorQuotes] = await Promise.all([
    Promise.all(INDICES.map((i) => safeQuote(i.symbol))),
    Promise.all(SECTORS.map((s) => safeQuote(s.symbol))),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold">MarketCap</h1>
        <p className="text-gray-600">
          Search for a stock to see live pricing, charts, and news.
        </p>
        <SearchBar />
        <Link href="/dashboard" className="text-sm underline">
          Go to your dashboard
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">US Markets</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {INDICES.map((idx, i) => (
            <IndexCard key={idx.symbol} name={idx.name} quote={indexQuotes[i]} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Sector Performance</h2>
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          {SECTORS.map((s, i) => (
            <SectorRow key={s.symbol} name={s.name} quote={sectorQuotes[i]} />
          ))}
        </div>
      </section>
    </div>
  );
}
