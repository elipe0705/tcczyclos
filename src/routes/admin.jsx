import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
