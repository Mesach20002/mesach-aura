"use client"

import {
  IconCheck,
  IconExternalLink,
  IconPhoto,
  IconPlus,
} from "@tabler/icons-react"
import Image from "next/image"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildProductRoutine } from "@/lib/recommendations/engine"
import type {
  ProductRecommendation,
  ProductRoutine,
  RoutinePeriod,
} from "@/lib/recommendations/types"

interface ProductRecommendationsProps {
  recommendations: ProductRecommendation[]
}

const routinePeriodLabels: Record<RoutinePeriod, string> = {
  morning: "Morning",
  night: "Night",
  weekly: "Weekly",
}

export function ProductRecommendations({
  recommendations,
}: ProductRecommendationsProps) {
  const [routineProductIds, setRoutineProductIds] = useState(
    () => new Set(recommendations.map(({ product }) => product.id))
  )
  const routine = buildProductRoutine(
    recommendations.filter(({ product }) => routineProductIds.has(product.id))
  )

  function toggleRoutineProduct(productId: string) {
    setRoutineProductIds((current) => {
      const next = new Set(current)

      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }

      return next
    })
  }

  return (
    <section className="space-y-8" aria-labelledby="product-recommendations">
      <div className="space-y-2">
        <h2
          id="product-recommendations"
          className="font-heading text-xl font-semibold text-foreground"
        >
          Aurora product suggestions
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          These cosmetic wellness suggestions are selected only from the
          official Aurora Organics catalogue. They are not a medical diagnosis.
        </p>
      </div>

      <div className="gap-5 md:grid-cols-2 xl:grid-cols-3 grid">
        {recommendations.map((recommendation) => {
          const isInRoutine = routineProductIds.has(recommendation.product.id)

          return (
            <Card
              key={recommendation.product.id}
              className="rounded-lg border-border py-0 shadow-sm overflow-hidden border"
            >
              <div className="bg-muted/40 relative aspect-[4/3] overflow-hidden">
                {recommendation.product.image ? (
                  <Image
                    src={recommendation.product.image}
                    alt={recommendation.product.name}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="gap-2 text-muted-foreground flex h-full flex-col items-center justify-center">
                    <IconPhoto className="size-8" aria-hidden />
                    <span className="text-xs">Official image unavailable</span>
                  </div>
                )}
              </div>

              <CardHeader className="space-y-3 pt-5">
                <div className="gap-3 flex items-start justify-between">
                  <CardTitle className="text-base">
                    {recommendation.product.name}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 capitalize">
                    {recommendation.product.category.replaceAll("-", " ")}
                  </Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {recommendation.product.shortDescription}
                </p>
              </CardHeader>

              <CardContent className="space-y-5 pb-5">
                <ProductDetail label="Why it was selected">
                  <p>{recommendation.reason}</p>
                </ProductDetail>

                <ProductDetail label="Main benefits">
                  <ul className="space-y-1 pl-4 list-disc">
                    {recommendation.product.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </ProductDetail>

                <ProductDetail label="Ingredients highlight">
                  <p>
                    {recommendation.product.ingredientsHighlight.join(", ")}
                  </p>
                </ProductDetail>

                <div>
                  <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    Price
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                    {recommendation.product.price ?? "Not listed by Aurora"}
                  </p>
                </div>

                <div className="gap-2 sm:grid-cols-2 grid">
                  <Button asChild data-icon="inline-end">
                    <a
                      href={recommendation.product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Product
                      <IconExternalLink className="size-4" aria-hidden />
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-icon="inline-start"
                    onClick={() =>
                      toggleRoutineProduct(recommendation.product.id)
                    }
                  >
                    {isInRoutine ? (
                      <IconCheck className="size-4" aria-hidden />
                    ) : (
                      <IconPlus className="size-4" aria-hidden />
                    )}
                    {isInRoutine ? "Added to Routine" : "Add to Routine"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {recommendations.length > 0 ? <RoutineBuilder routine={routine} /> : null}

      {recommendations.length === 0 ? (
        <div className="rounded-lg border-border bg-card p-6 text-sm text-muted-foreground border">
          No official Aurora Organics products match this report context.
        </div>
      ) : null}
    </section>
  )
}

function ProductDetail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2 text-sm leading-6 text-muted-foreground">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

function RoutineBuilder({ routine }: { routine: ProductRoutine }) {
  return (
    <div className="space-y-4 rounded-lg border-border bg-card p-5 shadow-sm border">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Your suggested routine
        </h3>
        <p className="text-sm text-muted-foreground">
          Organized automatically from your selected Aurora recommendations.
        </p>
      </div>

      <div className="gap-4 md:grid-cols-3 grid">
        {(Object.keys(routinePeriodLabels) as RoutinePeriod[]).map((period) => (
          <div
            key={period}
            className="rounded-lg border-border bg-background p-4 border"
          >
            <h4 className="font-heading text-sm font-semibold text-foreground">
              {routinePeriodLabels[period]}
            </h4>
            {routine[period].length > 0 ? (
              <ol className="mt-3 space-y-3">
                {routine[period].map((item) => (
                  <li key={`${item.step}-${item.product.id}`}>
                    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      {item.step.replaceAll("-", " ")}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {item.product.name}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No selected product for this routine.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
