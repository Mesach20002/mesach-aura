import { redirect } from "next/navigation"

import { DashboardLayout as AuroraDashboardLayout } from "@/components/dashboard/dashboard-layout"
import { getCurrentUser } from "@/lib/auth/session"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  return <AuroraDashboardLayout user={user}>{children}</AuroraDashboardLayout>
}
