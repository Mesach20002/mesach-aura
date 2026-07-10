import { LandingNav } from "@/components/marketing/landing-nav"

export async function MarketingShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
