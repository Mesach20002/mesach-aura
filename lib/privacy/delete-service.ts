import { deleteReport } from "@/lib/reports/service"
import { deleteStoredFile } from "@/lib/storage/storage-service"

export async function deleteUserReportData(reportId: string): Promise<void> {
  // Deletes from Prisma when DATABASE_URL is configured, otherwise mock storage.
  await deleteReport(reportId)
}

export async function deleteUserImageData(imageKey: string): Promise<void> {
  // TODO(storage): delete retained image object and associated database reference.
  await deleteStoredFile(imageKey)
}
