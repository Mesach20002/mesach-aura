import { IconDownload, IconShieldCheck } from "@tabler/icons-react"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { ConcernsBreakdownTable } from "@/components/admin/concerns-breakdown-table"
import {
  adminStats,
  concernsBreakdown,
  productRecommendations,
  recentScans,
} from "@/components/admin/mock-admin-data"
import { RecentScansTable } from "@/components/admin/recent-scans-table"
import { RecommendationsTable } from "@/components/admin/recommendations-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AdminDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <Badge className="rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
              Enterprise operations
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
                Admin Dashboard
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Monitor Aurora SkinSense scans, reports, recommendations, and
                platform activity.
              </p>
            </div>
          </div>
          <Button type="button" className="w-fit" data-icon="inline-start">
            <IconDownload className="size-4" aria-hidden />
            Export Reports
          </Button>
        </div>
      </header>

      <AdminStatsCards stats={adminStats} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <Card className="rounded-lg border border-border shadow-sm">
          <CardHeader>
            <AdminSectionHeader
              title="Recent Skin Scans"
              description="Review the latest cosmetic assessments and report processing states."
            />
          </CardHeader>
          <CardContent>
            <RecentScansTable scans={recentScans} />
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-border shadow-sm">
          <CardHeader>
            <AdminSectionHeader
              title="Skin Concerns Breakdown"
              description="Track coarse cosmetic concern bands from generated reports."
            />
          </CardHeader>
          <CardContent>
            <ConcernsBreakdownTable concerns={concernsBreakdown} />
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-lg border border-border shadow-sm">
        <CardHeader>
          <AdminSectionHeader
            title="Product Recommendations"
            description="Monitor Aurora product recommendation activity and customer intent signals."
          />
        </CardHeader>
        <CardContent>
          <RecommendationsTable recommendations={productRecommendations} />
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 text-xs leading-5 text-muted-foreground shadow-sm">
        <IconShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p>
          Aurora SkinSense provides cosmetic and wellness guidance only and is
          not intended for clinical use.
        </p>
      </div>
    </div>
  )
}
