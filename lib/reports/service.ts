import type { SkinAssessment } from "@/lib/ai/types"
import type { ClimateReportContext } from "@/lib/weather/types"
import {
  createReportRecord,
  deleteReportRecord,
  getReportRecordById,
  listRecentReportRecords,
} from "@/lib/reports/repository"

export function createReportFromAssessment(
  assessment: SkinAssessment,
  userId?: string,
  climate?: ClimateReportContext
) {
  return createReportRecord(assessment, userId, climate)
}

export function getReport(id: string) {
  return getReportRecordById(id)
}

export function listRecentReports(limit?: number) {
  return listRecentReportRecords(limit)
}

export function deleteReport(id: string) {
  return deleteReportRecord(id)
}
