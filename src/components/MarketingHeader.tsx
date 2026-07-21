import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="marketing-header">
      <Link href="/" className="brand-mark" aria-label="Northstar Portfolio home">
        <span className="brand-symbol">N</span>
        <span>Northstar</span>
      </Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        <Link href="/#markets">Markets</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Portfolio</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        {user ? (
          <>
            <Link href="/dashboard" className="button button-primary">Dashboard</Link>
            <form action={logout}>
              <button type="submit" className="button button-ghost">Log out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="button button-ghost">Log in</Link>
            <Link href="/signup" className="button button-primary">Start free</Link>
          </>
        )}
      </div>
    </header>
  );
}
