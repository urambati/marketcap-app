import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const origin = new URL(request.url).origin;
  if (!user) return NextResponse.redirect(`${origin}/login`, 303);

  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data?.stripe_customer_id) return NextResponse.redirect(`${origin}/pricing`, 303);
  const session = await getStripe().billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/pricing`,
  });
  return NextResponse.redirect(session.url, 303);
}
