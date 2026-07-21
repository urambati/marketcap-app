import Link from "next/link";

type EarningsItem = {
  symbol: string;
  date: string;
  epsEstimate?: number | null;
  revenueEstimate?: number | null;
};

export default function EarningsCalendar({
  items,
}: {
  items: EarningsItem[];
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No upcoming earnings found for this window.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs text-gray-500">
          <th className="pb-2 font-medium">Date</th>
          <th className="pb-2 font-medium">Company</th>
          <th className="pb-2 font-medium">EPS est.</th>
          <th className="pb-2 font-medium">Revenue est.</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={`${item.symbol}-${item.date}-${i}`} className="border-b last:border-0">
            <td className="py-2 text-gray-600">{item.date}</td>
            <td className="py-2">
              <Link href={`/stock/${item.symbol}`} className="font-medium underline">
                {item.symbol}
              </Link>
            </td>
            <td className="py-2">
              {item.epsEstimate != null ? item.epsEstimate.toFixed(2) : "—"}
            </td>
            <td className="py-2">
              {item.revenueEstimate != null
                ? `$${(item.revenueEstimate / 1_000_000).toFixed(0)}M`
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
