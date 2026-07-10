import { redirect } from "next/navigation"

import { ScanFlow } from "@/components/scan/scan-flow"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-session"
import { getCurrentUser } from "@/lib/auth/session"

export default async function ScanPage() {
  const user = await getCurrentUser()
  const allowDevBypass = isDevAuthBypassEnabled()

  if (!user && !allowDevBypass) {
    redirect("/login?redirect=/scan")
  }

  return <ScanFlow />
}
