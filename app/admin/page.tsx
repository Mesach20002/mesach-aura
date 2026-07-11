import { redirect } from "next/navigation"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getCurrentUser } from "@/lib/auth/session"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/admin")
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return <AdminDashboard />
}
