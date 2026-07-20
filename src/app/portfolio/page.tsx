import Link from "next/link";
import { getQuote } from "@/lib/finnhub";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { removeHolding } from "./actions";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: holdings } = await supabase
    .from("portfolios")
    .select("*")
    .order("added_at", { ascending: false });

  const quotes = await Promise.all(
    (holdings ?? []).map(async (h) => ({
      id: h.id,
      ticker: h.ticker,
      shares: h.shares,
      quote: await getQuote(h.ticker),
    }))
  );

  return (
    <div className="mx-auto mt-16 max-w-2xl px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Portfolio</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>

      <p className="mb-4 text-sm text-gray-600">Signed in as {user?.email}</p>

      {quotes.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {quotes.map((h) => {
            const change = h.quote.dp ?? 0;
            const isUp = change >= 0;
            return (
              <li
                key={h.id}
                className="flex items-center justify-between rounded border px-3 py-2"
              >
                <Link href={`/stock/${h.ticker}`} className="font-medium underline">
                  {h.ticker}
                </Link>
                <div className="flex items-center gap-4">
                  <span>${h.quote.c?.toFixed(2)}</span>
                  <span className={isUp ? "text-green-600" : "text-red-600"}>
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                  <form action={removeHolding}>
                    <input type="hidden" name="id" value={h.id} />
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
          No stocks saved yet. Search for one on the{" "}
          <Link href="/" className="underline">
            home page
          </Link>{" "}
          and add it to your portfolio.
        </p>
      )}
    </div>
  );
}
