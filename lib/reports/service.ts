import type { SkinAssessment } from "@/lib/ai/types"
import {
  createReportRecord,
  deleteReportRecord,
  getReportRecordById,
  listRecentReportRecords,
} from "@/lib/reports/repository"

export function createReportFromAssessment(
  assessment: SkinAssessment,
  userId?: string
) {
  return createReportRecord(assessment, userId)
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
