import type { Metadata } from "next";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { stripeIsConfigured } from "@/lib/stripe";

export const metadata: Metadata = { title: "Pricing" };

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: subscription } = user
    ? await supabase.from("subscriptions").select("status,current_period_end").eq("user_id", user.id).maybeSingle()
    : { data: null };
  const isPro = subscription && ["active", "trialing"].includes(subscription.status);

  return (
    <>
      <MarketingHeader />
      <main>
        <section className="pricing-hero">
          <span className="eyebrow">Simple, transparent pricing</span>
          <h1 className="hero-title">Invest with confidence.<br /><span>Upgrade when you’re ready.</span></h1>
          <p className="hero-copy">Start with a focused watchlist for free. Unlock deeper portfolio intelligence and unlimited tracking for $10 a month.</p>
          {params.success && <p className="mx-auto mt-6 max-w-lg rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm positive">Checkout completed. Your plan will update here after Stripe securely confirms the subscription.</p>}
          {params.canceled && <p className="mx-auto mt-6 max-w-lg rounded-xl border p-3 text-sm muted">Checkout canceled — your plan was not changed.</p>}
          {params.setup && <p className="mx-auto mt-6 max-w-lg rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">Stripe test keys still need to be added to the environment before checkout can open.</p>}
          {params.limit && <p className="mx-auto mt-6 max-w-lg rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 text-sm">You reached the Free plan’s 10-stock watchlist limit. Upgrade to Pro for unlimited tracking.</p>}
          {params.already && <p className="mx-auto mt-6 max-w-lg rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm positive">Your account already has Northstar Pro. Use Manage subscription to update billing or cancel.</p>}
        </section>

        <section className="pricing-grid" aria-label="Pricing plans">
          <article className="pricing-card">
            <h2 className="plan-name">Free</h2>
            <p className="muted mt-2 text-sm">A clear view of the market, at no cost.</p>
            <div className="plan-price"><strong>$0</strong><span>forever</span></div>
            <ul className="feature-list">
              <li>Save up to 10 stocks to your watchlist</li>
              <li>Live quotes and daily price charts</li>
              <li>Market news and earnings calendar</li>
              <li>Light and dark themes</li>
            </ul>
            <Link href={user ? "/dashboard" : "/signup"} className="button button-ghost mt-auto">{user ? "Open dashboard" : "Start free"}</Link>
          </article>

          <article className="pricing-card featured">
            <span className="plan-badge">Most popular</span>
            <h2 className="plan-name">Northstar Pro</h2>
            <p className="muted mt-2 text-sm">For investors building a serious process.</p>
            <div className="plan-price"><strong>$10</strong><span>/ month</span></div>
            <ul className="feature-list">
              <li>Unlimited watchlist stocks</li>
              <li>Portfolio allocation and sector analytics</li>
              <li>Cost basis and holdings performance</li>
              <li>Priority product features</li>
            </ul>
            {isPro ? (
              <form action="/api/stripe/portal" method="post" className="mt-auto"><button className="button button-primary w-full">Manage subscription</button></form>
            ) : (
              <form action="/api/stripe/checkout" method="post" className="mt-auto"><button className="button button-primary w-full">{stripeIsConfigured() ? "Start Pro in test mode" : "Configure Stripe to test"}</button></form>
            )}
            <p className="muted mt-3 text-center text-xs">Test mode only · Cancel anytime</p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
