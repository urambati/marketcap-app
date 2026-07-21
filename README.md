# Northstar Portfolio

Northstar Portfolio is a personal investment dashboard built as an educational,
non-commercial demo. It combines market quotes, company news, earnings, stock
charts, watchlists, portfolio analytics, Supabase authentication, and Stripe
sandbox subscriptions.

> Market data may be delayed. Nothing in this project is investment advice.

## Stack

- Next.js 16, React 19, TypeScript and Tailwind CSS 4
- Supabase Auth and Postgres with row-level security
- Finnhub for quotes, search, profiles and news
- Alpha Vantage for daily candles
- Stripe Checkout, Billing Portal and signed webhooks

## Local development

Copy `.env.local.example` to `.env.local`, add the required sandbox keys, run
the SQL in `supabase/schema.sql`, and then:

```powershell
npm.cmd install
npm.cmd run dev
```

For the complete Stripe sandbox listener setup:

```powershell
.\setup-stripe-local.cmd
```

See `STRIPE_SETUP.md` for details.

## Verification

```powershell
npm.cmd run lint
npm.cmd run build
```

## Vercel deployment

Import the GitHub repository into Vercel and add every key from
`.env.local.example` under Project Settings → Environment Variables. Never
upload `.env.local`.

After the first deployment:

1. Set `NEXT_PUBLIC_SITE_URL` to the final `https://*.vercel.app` URL.
2. Set the same URL as Supabase Authentication's Site URL and add it to Redirect URLs.
3. Create a Stripe sandbox webhook at `https://YOUR-URL/api/stripe/webhook`.
4. Subscribe it to `checkout.session.completed`,
   `customer.subscription.updated`, and `customer.subscription.deleted`.
5. Add that endpoint's `whsec_...` value to Vercel as
   `STRIPE_WEBHOOK_SECRET`, then redeploy.

Use separate Stripe live-mode credentials only if this project later becomes a
real commercial product.
