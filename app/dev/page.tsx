import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isPrismaAvailable } from "@/lib/db/client"
import { listRecentReports } from "@/lib/reports/service"

export const dynamic = "force-dynamic"

const developmentUrl = "http://localhost:3000"

const quickLinks = [
  { label: "/", href: "/" },
  { label: "/scan", href: "/scan" },
  { label: "/login", href: "/login" },
  { label: "/register", href: "/register" },
  { label: "/admin", href: "/admin" },
] as const

const statusItems = [
  "Landing Page",
  "Scan Flow",
  "Camera Capture",
  "Image Upload",
  "Report Generation",
  "AI Report Chat",
  "Admin Dashboard",
  "Authentication UI",
] as const

export default async function DeveloperLauncherPage() {
  const [latestReport] = await listRecentReports(1)
  const latestReportUrl = latestReport ? `/report/${latestReport.id}` : null
  const chatUrl = latestReport ? `${latestReportUrl}#report-ai-chat` : null
  const storageMode = isPrismaAvailable ? "Connected" : "Mock Mode"

  const launcherCards = [
    {
      label: "🏠 Landing Page",
      href: "/",
      description: "Open the public Aurora SkinSense landing page.",
      enabled: true,
    },
    {
      label: "📷 Start AI Skin Scan",
      href: "/scan",
      description: "Start consent, capture, upload, preview, and analysis.",
      enabled: true,
    },
    {
      label: "📄 Latest Generated Report",
      href: latestReportUrl,
      description: latestReport
        ? `Open report ${latestReport.id}.`
        : "Generate a report by completing a scan.",
      enabled: Boolean(latestReportUrl),
    },
    {
      label: "💬 AI Report Chat",
      href: chatUrl,
      description: latestReport
        ? "Jump to Aurora AI chat for the latest report."
        : "Generate a report to use report chat.",
      enabled: Boolean(chatUrl),
    },
    {
      label: "👤 Login",
      href: "/login",
      description: "Open the authentication login page.",
      enabled: true,
    },
    {
      label: "📝 Register",
      href: "/register",
      description: "Open the account registration page.",
      enabled: true,
    },
    {
      label: "🛡 Admin Dashboard",
      href: "/admin",
      description: "Review admin analytics and recommendation metrics.",
      enabled: true,
    },
  ] as const

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Development URL
          </p>
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">
            Aurora SkinSense Developer Launcher
          </h1>
          <p className="text-lg font-medium text-foreground">
            {developmentUrl}
          </p>
        </header>

        <section aria-labelledby="launcher-heading" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="launcher-heading"
                className="font-heading text-xl font-semibold"
              >
                Quick Launch
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                One-click navigation for the current local development build.
              </p>
            </div>
            {latestReportUrl ? (
              <Button asChild>
                <Link href={latestReportUrl}>Open Latest Report</Link>
              </Button>
            ) : (
              <Button disabled>Open Latest Report</Button>
            )}
          </div>

          {!latestReportUrl ? (
            <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              No reports have been generated yet.
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {launcherCards.map((item: any) =>
              item.enabled && item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Card className="h-full rounded-lg border border-border transition-colors group-hover:border-foreground/30">
                    <CardHeader>
                      <CardTitle>{item.label}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline">
                        <span>Open</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card
                  key={item.label}
                  className="h-full rounded-lg border border-border opacity-70"
                >
                  <CardHeader>
                    <CardTitle>{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled variant="outline">
                      Unavailable
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        <section aria-labelledby="quick-navigation-heading" className="space-y-4">
          <div>
            <h2
              id="quick-navigation-heading"
              className="font-heading text-xl font-semibold"
            >
              Quick Navigation
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Direct routes for smoke testing the local application.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Button key={link.href} asChild variant="outline">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {latestReportUrl ? (
              <Button asChild variant="outline">
                <Link href={latestReportUrl}>{latestReportUrl}</Link>
              </Button>
            ) : null}
          </div>
          {!latestReportUrl ? (
            <p className="text-sm text-muted-foreground">
              Generate a report by completing a scan.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="application-status-heading" className="space-y-4">
          <h2
            id="application-status-heading"
            className="font-heading text-xl font-semibold"
          >
            Application Status
          </h2>
          <Card className="rounded-lg border border-border">
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {statusItems.map((item: any) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm"
                >
                  <span>{item}</span>
                  <span aria-label="Ready">✅</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                <span>Database Connection</span>
                <span>{storageMode}</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
