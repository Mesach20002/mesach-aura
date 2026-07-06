import type { ReportDetail } from "@/types"

import { getReportsStore } from "@/lib/data-store"

export async function getReportDetail(reportId: string): Promise<ReportDetail | null> {
  const reports = await getReportsStore()

  return reports[reportId] ?? null
}
