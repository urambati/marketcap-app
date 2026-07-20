import { getCompanyNews } from "@/lib/finnhub";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/news/[ticker]">
) {
  const { ticker } = await ctx.params;
  const symbol = ticker.toUpperCase();

  const params = new URL(req.url).searchParams;
  const to = params.get("to") ?? isoDate(new Date());
  const from =
    params.get("from") ??
    isoDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const news = await getCompanyNews(symbol, from, to);
  return Response.json(news);
}
