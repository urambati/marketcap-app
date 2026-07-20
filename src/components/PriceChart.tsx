"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Candle = { date: string; close: number };

export default function PriceChart({ candles }: { candles: Candle[] }) {
  if (candles.length === 0) {
    return <p className="text-sm text-gray-500">No chart data available.</p>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={candles}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={40} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#16a34a"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
