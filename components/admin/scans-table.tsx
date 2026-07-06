import type { AdminAnalyticsSummary, ScanStatus } from "@/types"

interface ScansTableProps {
  scans: AdminAnalyticsSummary["recentScans"]
}

const statusClassName: Record<ScanStatus, string> = {
  processed: "bg-primary text-primary-foreground",
  pending: "bg-secondary text-secondary-foreground",
  failed: "bg-destructive/10 text-destructive",
}

function formatScanDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function ScansTable({ scans }: ScansTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Overall score</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {scans.map((scan) => (
            <tr key={scan.scanId}>
              <td className="px-4 py-4 font-medium text-foreground">
                {scan.userFullName}
              </td>
              <td className="px-4 py-4 text-muted-foreground">
                {scan.overallScore ?? "-"}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${statusClassName[scan.status]}`}
                >
                  {scan.status}
                </span>
              </td>
              <td className="px-4 py-4 text-muted-foreground">
                {formatScanDate(scan.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
