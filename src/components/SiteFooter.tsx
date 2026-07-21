import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs muted sm:flex-row sm:items-center sm:justify-between">
        <p>Northstar Portfolio is an educational demo. Market data may be delayed and is not investment advice.</p>
        <div className="flex gap-4">
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Portfolio</Link>
          <a href="https://github.com/urambati/marketcap-app" target="_blank" rel="noreferrer">Source</a>
        </div>
      </div>
    </footer>
  );
}
