import ThemeToggle from "./ThemeToggle";

export default function Topbar({ email }: { email?: string }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-violet-500">Your workspace</p><h1 className="text-xl font-semibold">Portfolio overview</h1></div>
      <div className="flex items-center gap-3"><ThemeToggle />{email && <span className="hidden text-sm text-gray-600 md:inline">{email}</span>}</div>
    </header>
  );
}
