type Quote = { c?: number; dp?: number };

export default function SectorRow({
  name,
  quote,
}: {
  name: string;
  quote: Quote | null;
}) {
  const changePct = quote?.dp ?? 0;
  const isUp = changePct >= 0;

  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span>{name}</span>
      {quote?.c != null ? (
        <span className="flex items-center gap-3">
          <span>{quote.c.toFixed(2)}</span>
          <span className={isUp ? "text-green-600" : "text-red-600"}>
            {isUp ? "+" : ""}
            {changePct.toFixed(2)}%
          </span>
        </span>
      ) : (
        <span className="text-xs text-gray-400">Unavailable</span>
      )}
    </div>
  );
}
