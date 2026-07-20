import { getDailyCandles } from "@/lib/alphavantage";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/candles/[ticker]">
) {
  const { ticker } = await ctx.params;
  const symbol = ticker.toUpperCase();

  const data = await getDailyCandles(symbol);
  return Response.json(data);
}
