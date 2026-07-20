import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24">
      <h1 className="text-3xl font-semibold">MarketCap</h1>
      <p className="text-center text-gray-600">
        Search for a stock to see live pricing, charts, and news.
      </p>

      <SearchBar />

      <Link href="/dashboard" className="text-sm underline">
        Go to your dashboard
      </Link>
    </div>
  );
}
