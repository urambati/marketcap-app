import Link from "next/link";
import SearchBar from "./SearchBar";
import { logout } from "@/app/login/actions";

export default function Sidebar({ signedIn }: { signedIn: boolean }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 border-r bg-white px-4 py-6">
      <Link href="/" className="text-lg font-semibold">
        MarketCap
      </Link>

      <SearchBar />

      <nav className="flex flex-col gap-1 text-sm">
        <Link
          href="/dashboard"
          className="rounded px-3 py-2 font-medium hover:bg-gray-100"
        >
          Dashboard
        </Link>
        <Link href="/" className="rounded px-3 py-2 hover:bg-gray-100">
          Markets
        </Link>
      </nav>

      <div className="mt-auto">
        {signedIn ? (
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Log out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}
