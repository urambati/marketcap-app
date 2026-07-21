"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#16a34a", "#2563eb", "#9333ea", "#f59e0b", "#dc2626", "#0891b2"];

export default function PortfolioAllocationChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No holdings yet — allocation will show up here once you own shares.
      </p>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
