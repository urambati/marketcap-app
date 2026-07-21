"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addHolding(formData: FormData) {
  const ticker = formData.get("ticker") as string;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to add to portfolio");
  }

  const [{ data: subscription }, { count }] = await Promise.all([
    supabase.from("subscriptions").select("status").eq("user_id", user.id).maybeSingle(),
    supabase.from("portfolios").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);
  const isPro = subscription && ["active", "trialing"].includes(subscription.status);
  if (!isPro && (count ?? 0) >= 10) redirect("/pricing?limit=watchlist");

  await supabase.from("portfolios").upsert({
    user_id: user.id,
    ticker: ticker.toUpperCase(),
  }, { onConflict: "user_id,ticker", ignoreDuplicates: true });

  revalidatePath("/dashboard");
}

export async function removeHolding(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  await supabase.from("portfolios").delete().eq("id", id);

  revalidatePath("/dashboard");
}

export async function updateHolding(formData: FormData) {
  const id = formData.get("id") as string;
  const shares = Number(formData.get("shares"));
  const costBasis = formData.get("costBasis")
    ? Number(formData.get("costBasis"))
    : null;

  if (!shares || shares <= 0) {
    throw new Error("Shares must be a positive number");
  }

  const supabase = await createClient();
  await supabase
    .from("portfolios")
    .update({ shares, cost_basis: costBasis })
    .eq("id", id);

  revalidatePath("/dashboard");
}
