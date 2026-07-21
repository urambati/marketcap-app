import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 sm:flex-row">
      <Sidebar signedIn={!!user} />
      <div className="flex flex-1 flex-col">
        <Topbar email={user?.email} />
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
