import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ConcernBreakdown, SeverityBand } from "@/lib/admin/types"

const severityLabels: Record<SeverityBand, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
}

const severityVariants: Record<
  SeverityBand,
  "default" | "secondary" | "outline"
> = {
  low: "outline",
  moderate: "secondary",
  high: "default",
}

interface ConcernsBreakdownTableProps {
  concerns: ConcernBreakdown[]
}

export function ConcernsBreakdownTable({
  concerns,
}: ConcernsBreakdownTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Concern</TableHead>
            <TableHead>Severity Band</TableHead>
            <TableHead className="text-right">Number of Reports</TableHead>
            <TableHead>Suggested Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerns.map((concern) => (
            <TableRow key={concern.id}>
              <TableCell className="font-medium text-foreground">
                {concern.concern}
              </TableCell>
              <TableCell>
                <Badge variant={severityVariants[concern.severityBand]}>
                  {severityLabels[concern.severityBand]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {concern.reportCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {concern.suggestedAction}
              </TableCell>
            </TableRow>
          ))}
          {concerns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No skin concern breakdown available.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
