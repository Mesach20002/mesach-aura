import { redirect } from "next/navigation"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminAnalytics } from "@/lib/admin/analytics-service"
import { getCurrentUser } from "@/lib/auth/session"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/admin")
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const analytics = await getAdminAnalytics()

  return <AdminDashboard analytics={analytics} />
}
