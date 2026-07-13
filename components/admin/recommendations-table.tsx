import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProductRecommendationMetric } from "@/lib/admin/types"

interface RecommendationsTableProps {
  recommendations: ProductRecommendationMetric[]
}

export function RecommendationsTable({
  recommendations,
}: RecommendationsTableProps) {
  return (
    <div className="rounded-lg border-border overflow-hidden border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Matched Concern</TableHead>
            <TableHead className="text-right">Recommendation Count</TableHead>
            <TableHead>Success Signal</TableHead>
            <TableHead>Last Recommended</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((recommendation) => (
            <TableRow key={recommendation.id}>
              <TableCell className="font-medium text-foreground">
                {recommendation.productName}
              </TableCell>
              <TableCell>{recommendation.matchedConcern}</TableCell>
              <TableCell className="text-right">
                {recommendation.recommendationCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {recommendation.conversionIntent}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {recommendation.lastRecommended}
              </TableCell>
            </TableRow>
          ))}
          {recommendations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-muted-foreground text-center"
              >
                No recommendation metrics to show.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <p className="border-border bg-card px-4 py-3 text-xs leading-5 text-muted-foreground border-t">
        Recommendations are cosmetic and wellness suggestions only for routine
        self-care context.
      </p>
    </div>
  )
}
