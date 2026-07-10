import { AccountDetailsCard } from "@/components/account/account-details-card"
import { requireUser } from "@/lib/auth/session"
import { listRecentReports } from "@/lib/reports/service"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const user = await requireUser()
  const reports = await listRecentReports(50)
  const reportCount = reports.filter(
    (report) => report.userId === user.id || report.userId == null
  ).length

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Aurora Account
        </p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Aurora Account Details
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Review your profile and Aurora SkinSense account activity.
        </p>
      </div>
      <AccountDetailsCard user={user} reportCount={reportCount} />
    </div>
  )
}
