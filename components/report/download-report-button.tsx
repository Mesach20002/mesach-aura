"use client"

import { IconDownload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function DownloadReportButton() {
  // Replace browser print with server-side PDF generation in the next milestone.
  return (
    <Button type="button" onClick={() => window.print()}>
      <IconDownload className="size-4" aria-hidden />
      Download / Print Report
    </Button>
  )
}
