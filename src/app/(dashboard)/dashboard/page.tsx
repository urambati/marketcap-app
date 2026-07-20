import Link from "next/link";
import PortfolioAllocationChart from "@/components/PortfolioAllocationChart";
import PromoteToHoldingForm from "@/components/PromoteToHoldingForm";
import SectorBreakdown from "@/components/SectorBreakdown";
import { getProfile, getQuote } from "@/lib/finnhub";
import { createClient } from "@/lib/supabase/server";
import { removeHolding } from "../../portfolio/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("portfolios")
    .select("*")
    .order("added_at", { ascending: false });

  const enriched = await Promise.all(
    (rows ?? []).map(async (row) => {
      const [quote, profile] = await Promise.all([
        getQuote(row.ticker),
        getProfile(row.ticker),
      ]);
      return { ...row, quote, profile };
    })
  );

  const holdings = enriched.filter((r) => r.shares != null && r.shares > 0);
  const watchlist = enriched.filter((r) => !r.shares || r.shares <= 0);

  const totalValue = holdings.reduce(
    (sum, h) => sum + h.shares * (h.quote.c ?? 0),
    0
  );

  const allocationData = holdings.map((h) => ({
    name: h.ticker,
    value: h.shares * (h.quote.c ?? 0),
  }));

  const sectorTotals = new Map<string, number>();
  for (const h of holdings) {
    const sector = h.profile.finnhubIndustry ?? "Other";
    const value = h.shares * (h.quote.c ?? 0);
    sectorTotals.set(sector, (sectorTotals.get(sector) ?? 0) + value);
  }
  const sectors = Array.from(sectorTotals, ([name, value]) => ({
    name,
    value,
  }));

  const avgChange =
    holdings.length > 0
      ? holdings.reduce((sum, h) => sum + (h.quote.dp ?? 0), 0) /
        holdings.length
      : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryStat label="Portfolio Value" value={`$${totalValue.toFixed(2)}`} />
        <SummaryStat label="Holdings" value={holdings.length} />
        <SummaryStat label="Watchlist" value={watchlist.length} />
        <SummaryStat
          label="Avg Day Change"
          value={`${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`}
          positive={avgChange >= 0}
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">My Portfolio</h2>
        {holdings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {holdings.map((h) => (
              <HoldingCard key={h.id} holding={h} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No holdings yet. Add shares to a watchlist item below, or search
            for a stock on the <Link href="/" className="underline">home page</Link>.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Portfolio Allocation</h2>
          <PortfolioAllocationChart data={allocationData} />
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Sector Breakdown</h2>
          <SectorBreakdown sectors={sectors} />
        </section>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Watchlist</h2>
        {watchlist.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {watchlist.map((w) => {
              const change = w.quote.dp ?? 0;
              const isUp = change >= 0;
              return (
                <li
                  key={w.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border px-3 py-2"
                >
                  <Link href={`/stock/${w.ticker}`} className="font-medium underline">
                    {w.ticker}
                  </Link>
                  <span>${w.quote.c?.toFixed(2)}</span>
                  <span className={isUp ? "text-green-600" : "text-red-600"}>
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                  <div className="flex items-center gap-3">
                    <PromoteToHoldingForm id={w.id} />
                    <form action={removeHolding}>
                      <input type="hidden" name="id" value={w.id} />
                      <button type="submit" className="text-sm text-gray-500 underline">
                        Remove
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">
            Nothing tracked yet. Search for a stock and add it to your
            watchlist.
          </p>
        )}
      </section>

      <p className="text-xs text-gray-400">Signed in as {user?.email}</p>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string | number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`text-xl font-semibold ${
          positive === undefined
            ? ""
            : positive
              ? "text-green-600"
              : "text-red-600"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function HoldingCard({
  holding,
}: {
  holding: {
    id: string;
    ticker: string;
    shares: number;
    quote: { c?: number; dp?: number };
    profile: { name?: string };
  };
}) {
  const change = holding.quote.dp ?? 0;
  const isUp = change >= 0;

  return (
    <Link
      href={`/stock/${holding.ticker}`}
      className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{holding.ticker}</span>
        <span className={isUp ? "text-green-600" : "text-red-600"}>
          {isUp ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
      <p className="text-xs text-gray-500">{holding.profile.name}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-lg font-semibold">
          ${((holding.quote.c ?? 0) * holding.shares).toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">
          {holding.shares} shares
        </span>
      </div>
    </Link>
  );
}
