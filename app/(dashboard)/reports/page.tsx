import { IconFileDescription, IconPrinter } from "@tabler/icons-react"
import { notFound } from "next/navigation"

import { ProductRecommendations } from "@/components/report/product-recommendations"
import { ReportDownloadButton } from "@/components/report/report-download-button"
import { getProductRecommendations } from "@/lib/recommendations/engine"
import type { SeverityBand } from "@/lib/recommendations/types"
import { getReportDetail } from "@/lib/reports"

const REPORT_ID = "aur-1048"

export default async function ReportsPage() {
  const report = await getReportDetail(REPORT_ID)

  if (!report) {
    notFound()
  }

  const recommendations = getProductRecommendations({
    skinType: report.profile,
    concerns: report.findings.flatMap((finding) =>
      getConcernTerms(finding.label)
    ),
    severityBands: Object.fromEntries(
      report.findings.flatMap((finding) =>
        getConcernTerms(finding.label).map((concern) => [
          concern,
          getSeverityBand(finding.band),
        ])
      )
    ) as Partial<Record<string, SeverityBand>>,
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 print:hidden md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Phase 1 · Downloadable reports
          </p>
          <h1 className="text-3xl font-medium">Skin reports</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Review the generated cosmetic skin report and export it as a PDF using
            the browser save dialog.
          </p>
        </div>
        <ReportDownloadButton reportId={report.id} />
      </div>

      <article className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-8 print:border-0 print:p-10">
        <header className="flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <IconFileDescription className="size-5 text-muted-foreground" aria-hidden />
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Aurora SkinSense report
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-medium">Cosmetic skin assessment</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {report.disclaimer}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">Report {report.reportNumber}</p>
            <p className="mt-1 text-muted-foreground">Generated: {report.generatedAt}</p>
            <p className="mt-1 text-muted-foreground">Profile: {report.profile}</p>
          </div>
        </header>

        <section className="grid gap-4 py-6 md:grid-cols-3" aria-label="Skin findings">
          {report.findings.map((finding) => (
            <div key={finding.label} className="rounded-lg border border-border p-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {finding.label}
              </p>
              <p className="mt-3 text-lg font-medium text-foreground">{finding.band}</p>
              <p className="mt-3 text-sm font-medium text-foreground">Client takeaway</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {finding.clientMessage ?? finding.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="border-t border-border py-6">
          <ProductRecommendations recommendations={recommendations} />
        </section>

        <section className="border-t border-border pt-6" aria-labelledby="export-heading">
          <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
            <IconPrinter className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <h3 id="export-heading" className="text-sm font-medium">
                PDF export ready
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {report.exportNote}
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}

function getSeverityBand(value: string): SeverityBand {
  const band = value.toLowerCase()

  if (band.includes("high") || band.includes("noticeable")) return "high"
  if (band.includes("moderate") || band.includes("balanced")) return "moderate"

  return "low"
}

function getConcernTerms(label: string): string[] {
  switch (label.toLowerCase()) {
    case "hydration":
      return ["hydration", "dryness"]
    case "texture":
      return ["uneven texture", "rough texture"]
    case "pigmentation":
      return ["pigmentation appearance", "dark spots appearance", "uneven tone"]
    default:
      return [label.toLowerCase()]
  }
}
