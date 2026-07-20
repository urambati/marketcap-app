import { getProfile, getQuote } from "@/lib/finnhub";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/quote/[ticker]">
) {
  const { ticker } = await ctx.params;
  const symbol = ticker.toUpperCase();

  const [quote, profile] = await Promise.all([
    getQuote(symbol),
    getProfile(symbol),
  ]);

  return Response.json({ symbol, quote, profile });
}
