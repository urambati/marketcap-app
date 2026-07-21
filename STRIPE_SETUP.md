# Stripe test-mode setup

## One-command Windows setup

After adding `STRIPE_SECRET_KEY` and `STRIPE_PRO_PRICE_ID` to `.env.local`, run
this from Command Prompt at the project root:

```cmd
setup-stripe-local.cmd
```

The script signs into Stripe, obtains the local webhook signing secret, writes
it to `.env.local` without displaying it, starts the app when port 3000 is free,
and launches the webhook listener in a separate window.

The pricing page and subscription routes are implemented for Stripe test mode.

1. In Stripe Dashboard, enable **Test mode**.
2. Create a product named **Northstar Pro**.
3. Add a recurring monthly price of **$10 USD**.
4. Copy the test secret key and recurring Price ID into `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Run the new `subscriptions` SQL and unique portfolio index from
   `supabase/schema.sql` in Supabase SQL Editor.
6. For local webhook testing, install Stripe CLI, sign in, and forward events:

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` value printed by Stripe CLI into `.env.local`, then restart
the development server.

Use Stripe's standard test card `4242 4242 4242 4242`, any future expiry, and
any three-digit CVC. Never place live Stripe keys in `.env.local` while testing.

The webhook listens for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

For a hosted deployment, create a Stripe webhook endpoint targeting
`https://your-domain.example/api/stripe/webhook` and subscribe to those events.
