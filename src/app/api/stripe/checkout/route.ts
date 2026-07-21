import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, stripeIsConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const origin = new URL(request.url).origin;

  if (!user) return NextResponse.redirect(`${origin}/login?redirectedFrom=/pricing`, 303);
  if (!stripeIsConfigured()) return NextResponse.redirect(`${origin}/pricing?setup=stripe`, 303);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id,status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscription && ["active", "trialing"].includes(subscription.status)) {
    return NextResponse.redirect(`${origin}/pricing?already=pro`, 303);
  }

  const stripe = getStripe();
  const idempotencyWindow = Math.floor(Date.now() / (5 * 60 * 1000));
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: subscription?.stripe_customer_id || undefined,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/pricing?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=1`,
    allow_promotion_codes: true,
    integration_identifier: "northstar_web_qxmvrtpk",
    subscription_data: { metadata: { supabase_user_id: user.id } },
    metadata: { supabase_user_id: user.id },
  }, { idempotencyKey: `northstar-checkout-${user.id}-${idempotencyWindow}` });

  return NextResponse.redirect(session.url!, 303);
}
