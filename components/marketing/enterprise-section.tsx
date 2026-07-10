import {
  IconBuildingStore,
  IconBuildingHospital,
  IconPalette,
  IconUsersGroup,
} from "@tabler/icons-react"

import { SectionBadge } from "@/components/marketing/section-badge"

const enterpriseItems = [
  {
    title: "Clinics",
    description:
      "Prepared for guided intake, admin analytics, and expert review paths.",
    icon: IconBuildingHospital,
  },
  {
    title: "Salons",
    description:
      "Built for client-facing wellness guidance and repeat report engagement.",
    icon: IconBuildingStore,
  },
  {
    title: "Beauty brands",
    description:
      "Ready for branded skin insight experiences and API-ready architecture.",
    icon: IconPalette,
  },
  {
    title: "White-label SaaS",
    description:
      "Structured for multi-tenant future, expert marketplace readiness, and configuration.",
    icon: IconUsersGroup,
  },
]

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <SectionBadge>Enterprise SaaS Future</SectionBadge>
            <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Built to expand beyond a single storefront.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Aurora SkinSense is designed for admin analytics, expert
              marketplace readiness, API-ready architecture, and a multi-tenant
              future for modern beauty and wellness teams.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {enterpriseItems.map((item: any) => {
              const ItemIcon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                      <ItemIcon className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
