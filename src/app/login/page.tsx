import Link from "next/link";
import { login } from "./actions";
import MarketingHeader from "@/components/MarketingHeader";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; redirectedFrom?: string }>;
}) {
  const { error, message, redirectedFrom } = await searchParams;

  return (
    <>
      <MarketingHeader />
      <main className="auth-shell">
      <section className="premium-card w-full max-w-md p-8">
      <span className="eyebrow">Welcome back</span>
      <h1 className="mb-2 mt-5 text-3xl font-semibold tracking-tight">Log in to Northstar</h1>
      <p className="muted mb-6 text-sm">Your watchlist and portfolio are waiting.</p>

      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="redirectTo" value={redirectedFrom ?? "/dashboard"} />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          autoComplete="current-password"
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="button button-primary"
        >
          Log in
        </button>
      </form>

      <p className="mt-4 text-sm">
        No account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </p>
      </section>
      </main>
    </>
  );
}
