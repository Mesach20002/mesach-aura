import { AnalyticsCards } from "@/components/admin/analytics-cards"
import { ScansTable } from "@/components/admin/scans-table"
import { getAdminAnalyticsSummary } from "@/lib/analytics"

function formatConcernLabel(value: string) {
  return value.replace("_", " ")
}

// TODO(auth-team): wrap this page with an admin-only auth check.
export default async function AdminPage() {
  const summary = await getAdminAnalyticsSummary()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Phase 1 · Admin analytics
        </p>
        <h1 className="text-3xl font-medium">Admin dashboard</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Monitor scan activity, cosmetic skin concern trends, generated reports, and
          Aurora product recommendation performance from one operational view.
        </p>
      </div>

      <AnalyticsCards summary={summary} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.7fr)]">
        <section
          className="rounded-lg border border-border bg-card p-6"
          aria-labelledby="scans-heading"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="scans-heading" className="text-xl font-medium">
                Recent scans
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest AI skin assessments and processing status.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ScansTable scans={summary.recentScans} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6" aria-labelledby="concerns-heading">
          <h2 id="concerns-heading" className="text-xl font-medium">
            Concern analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aggregated cosmetic concern bands from completed scans.
          </p>

          <div className="mt-6 space-y-5">
            {summary.topConcerns.map((concern) => (
              <div
                key={concern.concernType}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="font-medium capitalize text-foreground">
                  {formatConcernLabel(concern.concernType)}
                </span>
                <span className="text-muted-foreground">{concern.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section
        className="rounded-lg border border-border bg-card p-6"
        aria-labelledby="products-heading"
      >
        <h2 id="products-heading" className="text-xl font-medium">
          Top recommended products
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aurora products most often matched to completed assessments.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {summary.topRecommendedProducts.map((product) => (
            <div key={product.productId} className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.count.toLocaleString()} recommendations
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
