import { NextResponse } from "next/server"

import { getReportDetail } from "@/lib/reports"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params
  const report = await getReportDetail(reportId)

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${report.reportNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
          h1 { margin-bottom: 8px; }
          .meta { color: #4b5563; margin-bottom: 24px; }
          .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <h1>Cosmetic skin assessment</h1>
        <div class="meta">Report ${report.reportNumber} • Generated: ${report.generatedAt} • Profile: ${report.profile}</div>
        <div class="card">
          <p>${report.disclaimer}</p>
        </div>
        <div class="grid">
          ${report.findings
            .map(
              (finding) => `
                <div class="card">
                  <h3>${finding.label}</h3>
                  <p><strong>${finding.band}</strong></p>
                  <p>${finding.clientMessage ?? finding.detail}</p>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="card">
          <h3>Recommended Aurora routine</h3>
          <ul>
            ${report.recommendedProducts.map((product) => `<li>${product.name}</li>`).join("")}
          </ul>
        </div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
