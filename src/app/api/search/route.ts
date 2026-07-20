import { searchSymbols } from "@/lib/finnhub";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");

  if (!q) {
    return Response.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const results = await searchSymbols(q);
  return Response.json(results);
}
