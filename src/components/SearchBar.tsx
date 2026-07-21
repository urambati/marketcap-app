"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SearchResult = {
  symbol: string;
  description: string;
  type: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 1) return;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        setResults(data.result ?? []);
      } catch {
        setResults([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (!value.trim()) {
            setResults([]);
            setError(false);
            setLoading(false);
          }
        }}
        placeholder="Search stocks (e.g. AAPL, Tesla)"
        className="w-full rounded border px-4 py-2 text-black"
      />

      {loading && (
        <p className="mt-1 text-sm text-gray-500">Searching…</p>
      )}

      {error && !loading && (
        <p className="mt-1 text-sm text-red-600">
          Search is temporarily unavailable. Try again in a moment.
        </p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg">
          {results.slice(0, 8).map((r) => (
            <li key={r.symbol}>
              <Link
                href={`/stock/${r.symbol}`}
                className="block px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => setResults([])}
              >
                <span className="font-medium">{r.symbol}</span>{" "}
                <span className="text-sm text-gray-600">
                  {r.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
