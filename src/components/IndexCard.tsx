type Quote = { c?: number; d?: number; dp?: number };

export default function IndexCard({
  name,
  quote,
}: {
  name: string;
  quote: Quote | null;
}) {
  if (!quote || quote.c == null) {
    return (
      <div className="premium-card p-4">
        <div className="text-sm font-medium">{name}</div>
        <div className="mt-2 text-xs text-gray-400">Unavailable</div>
      </div>
    );
  }

  const change = quote.d ?? 0;
  const changePct = quote.dp ?? 0;
  const isUp = change >= 0;

  return (
    <div className="premium-card p-4 hover:-translate-y-0.5">
      <div className="text-sm font-medium">{name}</div>
      <div className="mt-1 text-lg font-semibold">{quote.c.toFixed(2)}</div>
      <div className={`mt-1 text-sm ${isUp ? "text-green-600" : "text-red-600"}`}>
        {isUp ? "+" : ""}
        {change.toFixed(2)} ({isUp ? "+" : ""}
        {changePct.toFixed(2)}%)
      </div>
      <div
        className={`mt-3 h-1 w-full rounded-full ${
          isUp ? "bg-green-200" : "bg-red-200"
        }`}
      >
        <div
          className={`h-1 rounded-full ${isUp ? "bg-green-600" : "bg-red-600"}`}
          style={{ width: `${Math.min(Math.abs(changePct) * 20, 100)}%` }}
        />
      </div>
    </div>
  );
}
