import Link from "next/link"
import { redirect } from "next/navigation"

import { SkinReport } from "@/components/report/skin-report"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { canViewReport } from "@/lib/auth/permissions"
import { getCurrentUser } from "@/lib/auth/session"
import { getReport } from "@/lib/reports/service"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/login?redirect=/report/${id}`)
  }

  const report = await getReport(id)

  if (!report) {
    return <ReportNotFound />
  }

  if (!canViewReport(user, report.userId)) {
    redirect("/dashboard")
  }

  return <SkinReport report={report} />
}

function ReportNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-6 py-12">
      <Card className="w-full rounded-lg border border-border bg-card shadow-sm">
        <CardContent className="space-y-5 p-6 text-center">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              Report not found
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Please run a new scan to generate a fresh cosmetic skin report.
            </p>
          </div>
          <Button asChild>
            <Link href="/scan">Start Scan</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
