import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { recommendationEligibleProducts } from "@/lib/products/catalog"

const tabs = [
  "All",
  "Cleansers",
  "Moisturizers",
  "Serums",
  "Face Mists",
  "Lip Care",
]

const featuredProductIds = [
  "lavender-foaming-face-wash",
  "radiant-plump-moisturizer-with-glutathione",
  "gold-serum",
  "niacinamide-neem-toner",
  "radiant-rose-face-mist",
] as const

const products = featuredProductIds.flatMap((id) => {
  const product = recommendationEligibleProducts.find((item) => item.id === id)
  return product ? [product] : []
})

export function VisualReportPreview() {
  return (
    <section id="products" className="border-b border-border bg-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Skincare That Cares
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Curated for Your Skin
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground sm:px-6"
              data-active={index === 0}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {product.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-2 p-4">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {product.price ?? "Price not listed"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {product.category.replaceAll("-", " ")}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/scan">Get Your Recommendations</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
