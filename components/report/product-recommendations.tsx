import { IconExternalLink } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductRecommendation } from "@/lib/recommendations/types"

interface ProductRecommendationsProps {
  recommendations: ProductRecommendation[]
}

// TODO:
// Reintroduce product images later using locally stored assets in
// public/images/products/
// after all images have been verified and optimized.
export function ProductRecommendations({
  recommendations,
}: ProductRecommendationsProps) {
  return (
    <section className="space-y-4" aria-labelledby="product-recommendations">
      <div className="space-y-2">
        <h2
          id="product-recommendations"
          className="font-heading text-xl font-semibold text-foreground"
        >
          Aurora product suggestions
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Each cosmetic recommendation is a wellness suggestion that may support
          the appearance of skin concerns surfaced in your report.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.product.id}
            className="rounded-lg border border-border shadow-sm"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">
                {recommendation.product.name}
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                {recommendation.product.shortDescription}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Price
                </p>
                <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                  {recommendation.product.price ?? "Source price pending"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Matched concerns
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.matchedConcerns.map((concern) => (
                    <Badge
                      key={concern}
                      variant="secondary"
                      className="rounded-lg border border-border bg-background px-2 py-1"
                    >
                      {concern}
                    </Badge>
                  ))}
                  {recommendation.matchedConcerns.length === 0 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-lg border border-border bg-background px-2 py-1"
                    >
                      {recommendation.priorityBand}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {getRecommendationReason(recommendation.reason)}
              </p>

              {recommendation.product.productUrl ? (
                <Button asChild className="w-full" data-icon="inline-end">
                  <a
                    href={recommendation.product.productUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Product
                    <IconExternalLink className="size-4" aria-hidden />
                  </a>
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Product Link Pending
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No product suggestions are available for this report context.
        </div>
      ) : null}
    </section>
  )
}

function getRecommendationReason(reason: string): string {
  if (reason.toLowerCase().includes("cosmetic")) {
    return reason
  }

  return `${reason} This is a cosmetic recommendation and wellness suggestion that may support the appearance of report concerns.`
}
