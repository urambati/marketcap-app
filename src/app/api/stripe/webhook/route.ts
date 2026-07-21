import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return new Response("Webhook not configured", { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.supabase_user_id;
    if (userId && session.customer && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
      await saveSubscription(userId, subscription, String(session.customer));
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const userId = await resolveUserId(subscription);
    if (userId) await saveSubscription(userId, subscription, String(subscription.customer));
  }

  return Response.json({ received: true });
}

async function saveSubscription(userId: string, subscription: Stripe.Subscription, customerId: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price.id ?? null,
    status: subscription.status,
    current_period_end: new Date(subscription.items.data[0]?.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (error) throw new Error(`Subscription sync failed: ${error.message}`);
}

async function resolveUserId(subscription: Stripe.Subscription) {
  if (subscription.metadata.supabase_user_id) return subscription.metadata.supabase_user_id;
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", String(subscription.customer))
    .maybeSingle();
  return data?.user_id;
}
