"use client"

import { IconDownload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

type ReportDownloadButtonProps = {
  reportId: string
}

export function ReportDownloadButton({ reportId }: ReportDownloadButtonProps) {
  const handlePrint = () => {
    window.open(`/api/reports/${reportId}/print`, "_blank", "noopener,noreferrer")
  }

  return (
    <Button type="button" onClick={handlePrint}>
      <IconDownload data-icon="inline-start" />
      Save as PDF
    </Button>
  )
}
