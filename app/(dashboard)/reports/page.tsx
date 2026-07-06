import { IconFileDescription, IconPrinter } from "@tabler/icons-react"
import { notFound } from "next/navigation"

import { ReportDownloadButton } from "@/components/report/report-download-button"
import { getReportDetail } from "@/lib/reports"

const REPORT_ID = "aur-1048"

export default async function ReportsPage() {
  const report = await getReportDetail(REPORT_ID)

  if (!report) {
    notFound()
  }

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

        <section className="border-t border-border py-6" aria-labelledby="routine-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 id="routine-heading" className="text-xl font-medium">
              Recommended Aurora routine
            </h3>
            <p className="text-sm text-muted-foreground">Click a step to expand the details.</p>
          </div>
          <div className="mt-4 grid gap-3">
            {report.recommendedProducts.map((product, index) => (
              <details key={product.id} className="rounded-lg border border-border p-4">
                <summary className="flex cursor-pointer list-none items-center gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tap to view why it fits this routine
                    </p>
                  </div>
                </summary>
                <div className="mt-3 rounded-md border border-dashed border-border bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
                  This step is suggested for your profile to support hydration, texture balance,
                  and a more even-looking complexion.
                </div>
              </details>
            ))}
          </div>
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
