"use server";

import { revalidatePath } from "next/cache";
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

  await supabase.from("portfolios").insert({
    user_id: user.id,
    ticker: ticker.toUpperCase(),
  });

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
