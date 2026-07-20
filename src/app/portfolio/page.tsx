import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: holdings } = await supabase
    .from("portfolios")
    .select("*")
    .order("added_at", { ascending: false });

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Portfolio</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>

      <p className="mb-4 text-sm text-gray-600">Signed in as {user?.email}</p>

      {holdings && holdings.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {holdings.map((h) => (
            <li key={h.id} className="rounded border px-3 py-2">
              {h.ticker} — {h.shares ?? 0} shares
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">
          No stocks saved yet. (Add-to-portfolio UI comes in Phase 4.)
        </p>
      )}
    </div>
  );
}
