import type { ReportDetail } from "@/types"

import { getReportsStore } from "@/lib/data-store"
import { getReport } from "@/lib/reports/service"
import type { SkinReport } from "@/lib/reports/types"

export async function getReportDetail(
  reportId: string
): Promise<ReportDetail | null> {
  const reports = await getReportsStore()

  return reports[reportId] ?? null
}

export async function getSkinReport(reportId: string): Promise<SkinReport | null> {
  return getReport(reportId)
}

export type { SkinReport }
