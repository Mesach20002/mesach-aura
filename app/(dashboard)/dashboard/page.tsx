import Link from "next/link"
import {
  IconArrowRight,
  IconCalendarStats,
  IconCamera,
  IconChartBar,
  IconClock,
  IconFileDescription,
  IconMessageCircle,
  IconSparkles,
  IconUserCircle,
} from "@tabler/icons-react"

import { ReportAiChat } from "@/components/report/report-ai-chat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SeverityBand } from "@/lib/ai/types"
import { requireUser } from "@/lib/auth/session"
import type { AuthUser } from "@/lib/auth/types"
import { listRecentReports } from "@/lib/reports/service"
import type { SkinReport } from "@/lib/reports/types"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await requireUser()
  const reports = await getUserReports(user)
  const latestReport = reports[0] ?? null
  const averageScore =
    reports.length > 0
      ? Math.round(
          reports.reduce((total, report) => total + getReportScore(report), 0) /
            reports.length
        )
      : null

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-lg border border-border shadow-sm">
          <CardHeader className="space-y-3">
            <Badge className="w-fit rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
              Aurora Dashboard
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-normal normal-case md:text-4xl">
                Welcome, {user.name || user.email}
              </CardTitle>
              <CardDescription>
                Manage scans, reports, Aurora AI conversations, and your Aurora
                Account from one professional workspace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild data-icon="inline-start">
              <Link href="/scan">
                <IconCamera className="size-4" aria-hidden />
                Start New Scan
              </Link>
            </Button>
            <Button asChild variant="outline" data-icon="inline-start">
              <Link href="/reports">
                <IconFileDescription className="size-4" aria-hidden />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        <AccountSummaryCard user={user} reportCount={reports.length} />
      </section>

      <section aria-labelledby="quick-actions-heading" className="space-y-4">
        <SectionHeading
          id="quick-actions-heading"
          title="Quick Actions"
          description="Move quickly into the main Aurora SkinSense workflows."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            icon={IconCamera}
            title="Start New Scan"
            description="Begin consent, capture, upload, and AI analysis."
            href="/scan"
            actionLabel="Scan Now"
          />
          <QuickActionCard
            icon={IconFileDescription}
            title="Reports"
            description={`${reports.length} generated cosmetic skin report${reports.length === 1 ? "" : "s"}.`}
            href="/reports"
            actionLabel="View Reports"
          />
          <QuickActionCard
            icon={IconMessageCircle}
            title="Aurora AI Chat"
            description={
              latestReport
                ? "Continue with your latest report assistant."
                : "Generate a report before opening report chat."
            }
            href={
              latestReport
                ? `/report/${latestReport.id}#report-ai-chat`
                : undefined
            }
            actionLabel="Open Chat"
          />
          <QuickActionCard
            icon={IconUserCircle}
            title="Aurora Account"
            description="Review account details and profile status."
            href="/account"
            actionLabel="Manage Account"
          />
        </div>
      </section>

      <section aria-labelledby="dashboard-statistics-heading" className="space-y-4">
        <SectionHeading
          id="dashboard-statistics-heading"
          title="Dashboard Statistics"
          description="A concise operational view of your Aurora SkinSense activity."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={IconCamera}
            label="Skin Scans"
            value={reports.length.toString()}
          />
          <StatCard
            icon={IconFileDescription}
            label="Reports Generated"
            value={reports.length.toString()}
          />
          <StatCard
            icon={IconChartBar}
            label="Average Skin Score"
            value={averageScore ? `${averageScore}` : "Pending"}
          />
          <StatCard
            icon={IconClock}
            label="Last Scan Date"
            value={latestReport ? formatDate(latestReport.createdAt) : "None"}
          />
          <StatCard
            icon={IconCalendarStats}
            label="Future Appointments"
            value="0"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <div className="space-y-6">
          <RecentReports reports={reports.slice(0, 5)} />
          <RecentActivityTimeline
            user={user}
            latestReport={latestReport}
          />
        </div>

        <section
          id="aurora-ai-assistant"
          aria-labelledby="aurora-ai-assistant-heading"
          className="space-y-4"
        >
          <SectionHeading
            id="aurora-ai-assistant-heading"
            title="Aurora AI Assistant"
            description="Ask about your latest skin report."
          />
          {latestReport ? (
            <ReportAiChat reportId={latestReport.id} initialReport={latestReport} />
          ) : (
            <Card className="rounded-lg border border-border shadow-sm">
              <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconSparkles className="size-6" aria-hidden />
                </span>
                <div className="space-y-2">
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Generate your first scan to begin chatting with Aurora AI.
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Aurora AI uses report context, so it becomes available after
                    your first cosmetic skin report.
                  </p>
                </div>
                <Button asChild data-icon="inline-end">
                  <Link href="/scan">
                    Start New Scan
                    <IconArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </section>
    </div>
  )
}

async function getUserReports(user: AuthUser): Promise<SkinReport[]> {
  const reports = await listRecentReports(25)

  return reports.filter(
    (report) => report.userId === user.id || report.userId == null
  )
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  actionLabel,
}: {
  icon: typeof IconCamera
  title: string
  description: string
  href?: string
  actionLabel: string
}) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="space-y-4">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="space-y-2">
          <CardTitle className="text-lg tracking-normal normal-case">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {href ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={href}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" className="w-full" disabled>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IconCamera
  label: string
  value: string
}) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 truncate font-heading text-2xl font-semibold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentReports({ reports }: { reports: SkinReport[] }) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="tracking-normal normal-case">
            Recent Reports
          </CardTitle>
          <CardDescription>
            Latest cosmetic skin reports generated from Aurora scans.
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/reports">View Reports</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Skin Type</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>{formatSkinType(report.assessment.skinType)}</TableCell>
                  <TableCell>{getReportScore(report)}</TableCell>
                  <TableCell>
                    <Badge className="rounded-lg border border-border bg-background px-2 py-1 text-muted-foreground">
                      Generated
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/report/${report.id}`}>Open Report</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="rounded-lg border border-border bg-background p-6 text-sm leading-6 text-muted-foreground">
            No reports yet. Start a new scan to create your first Aurora
            SkinSense report.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecentActivityTimeline({
  user,
  latestReport,
}: {
  user: AuthUser
  latestReport: SkinReport | null
}) {
  const activities = [
    {
      title: "Account Created",
      detail: user.createdAt ? formatDate(user.createdAt) : "Aurora Account ready",
    },
    ...(latestReport
      ? [
          {
            title: "Skin Scan Completed",
            detail: formatDate(latestReport.createdAt),
          },
          {
            title: "Report Generated",
            detail: `Report ${latestReport.id}`,
          },
          {
            title: "Report Viewed",
            detail: "Available from the dashboard and report workspace",
          },
        ]
      : []),
  ]

  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="tracking-normal normal-case">
          Recent Activity
        </CardTitle>
        <CardDescription>
          Key account and scan events in your Aurora workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.title} className="flex gap-3">
              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                <span className="size-2 rounded-full bg-primary" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

function AccountSummaryCard({
  user,
  reportCount,
}: {
  user: AuthUser
  reportCount: number
}) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="tracking-normal normal-case">
          Aurora Account
        </CardTitle>
        <CardDescription>Signed in profile summary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm">
          <AccountRow label="Name" value={user.name ?? "Not provided"} />
          <AccountRow label="Email" value={user.email} />
          <AccountRow label="Username" value={user.username ?? "Not set"} />
          <AccountRow label="Member Since" value={user.createdAt ? formatDate(user.createdAt) : "Available after sign in"} />
          <AccountRow label="Role" value={user.role} />
          <AccountRow label="Total Reports" value={reportCount.toString()} />
        </dl>
        <Button asChild variant="outline" className="w-full">
          <Link href="/account">View Aurora Account</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <div className="space-y-2">
      <h2 id={id} className="font-heading text-xl font-semibold text-foreground">
        {title}
      </h2>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function getReportScore(report: SkinReport): number {
  const values = Object.values(report.assessment.concerns)

  if (values.length === 0) {
    return 0
  }

  const total = values.reduce((sum, band) => sum + getBandScore(band), 0)

  return Math.round(total / values.length)
}

function getBandScore(band: SeverityBand): number {
  switch (band) {
    case "low":
      return 92
    case "moderate":
      return 76
    case "high":
      return 58
  }
}

function formatSkinType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
