const COLORS = ["#16a34a", "#2563eb", "#9333ea", "#f59e0b", "#dc2626", "#0891b2"];

export default function SectorBreakdown({
  sectors,
}: {
  sectors: { name: string; value: number }[];
}) {
  if (sectors.length === 0) {
    return <p className="text-sm text-gray-500">No sector data yet.</p>;
  }

  const total = sectors.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {sectors.map((s, i) => (
          <div
            key={s.name}
            style={{
              width: `${(s.value / total) * 100}%`,
              backgroundColor: COLORS[i % COLORS.length],
            }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-1 text-sm">
        {sectors.map((s, i) => (
          <li key={s.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {s.name}
            </span>
            <span className="text-gray-600">${s.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
