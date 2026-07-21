import Link from "next/link";
import { signup } from "../login/actions";
import MarketingHeader from "@/components/MarketingHeader";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <MarketingHeader />
      <main className="auth-shell">
      <section className="premium-card w-full max-w-md p-8">
      <span className="eyebrow">Free to start</span>
      <h1 className="mb-2 mt-5 text-3xl font-semibold tracking-tight">Create your Northstar</h1>
      <p className="muted mb-6 text-sm">Build a focused watchlist and learn how your portfolio moves.</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <form action={signup} className="flex flex-col gap-4">
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
          autoComplete="new-password"
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="button button-primary"
        >
          Sign up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
      </section>
      </main>
    </>
  );
}
