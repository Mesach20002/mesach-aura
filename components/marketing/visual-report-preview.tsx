import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const tabs = [
  "All",
  "Cleansers",
  "Moisturizers",
  "Serums",
  "Sunscreens",
  "Body Care",
]

const products = [
  {
    name: "Radiance Gentle Cleanser",
    price: "PKR 1,890",
    rating: "(128)",
  },
  {
    name: "Hydra Glow Moisturizer",
    price: "PKR 2,250",
    rating: "(96)",
  },
  {
    name: "Glow Vitamin C Serum",
    price: "PKR 2,890",
    rating: "(176)",
  },
  {
    name: "Daily UV Defense SPF 50+",
    price: "PKR 2,150",
    rating: "(210)",
  },
  {
    name: "Night Repair Cream",
    price: "PKR 2,490",
    rating: "(143)",
  },
] as const

export function VisualReportPreview() {
  return (
    <section id="products" className="border-b border-border bg-primary/5">
      <div className="mx-auto max-w-7xl px-6 py-20">
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
            <button
              key={tab}
              type="button"
              className="rounded-lg border border-border bg-card px-6 py-2 text-sm text-foreground shadow-sm data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={index === 0}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background">
                <Image
                  src="/images/landing/skincare-products-lineup.png"
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {product.price}
                </p>
                <p className="text-sm text-primary">
                  ★★★★★{" "}
                  <span className="text-xs text-muted-foreground">
                    {product.rating}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/login?redirect=/scan">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
