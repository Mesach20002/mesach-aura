import { IconDotsVertical } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RecentScan, RecentScanStatus } from "@/lib/admin/types"

const statusLabels: Record<RecentScanStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
}

const statusVariants: Record<
  RecentScanStatus,
  "default" | "secondary" | "destructive"
> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
}

interface RecentScansTableProps {
  scans: RecentScan[]
}

export function RecentScansTable({ scans }: RecentScansTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Skin Type</TableHead>
            <TableHead>Main Concern</TableHead>
            <TableHead>Report Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map((scan) => (
            <TableRow key={scan.id}>
              <TableCell className="font-medium text-foreground">
                {scan.userName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {scan.skinType}
              </TableCell>
              <TableCell>{scan.mainConcern}</TableCell>
              <TableCell>
                <Badge variant={statusVariants[scan.status]}>
                  {statusLabels[scan.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {scan.date}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Open actions for ${scan.userName}`}
                    >
                      <IconDotsVertical className="size-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Report</DropdownMenuItem>
                    <DropdownMenuItem>Re-analyze</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {scans.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No recent skin scans to show.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
