import { AdminConsole } from "@/components/admin-console";
import { requireAdminPage } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAdminPage();
  return <AdminConsole />;
}
