export default function Topbar({ email }: { email?: string }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <h1 className="text-xl font-semibold">Good Morning!</h1>
      {email && <span className="text-sm text-gray-600">{email}</span>}
    </header>
  );
}
