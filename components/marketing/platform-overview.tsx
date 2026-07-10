import {
  IconCamera,
  IconDroplet,
  IconHeart,
  IconLock,
  IconRosetteDiscountCheck,
  IconSparkles,
} from "@tabler/icons-react"

const statItems = [
  { label: "2M+", helper: "Scans Completed", icon: IconRosetteDiscountCheck },
  { label: "98%", helper: "User Satisfaction", icon: IconHeart },
  { label: "AI-Powered", helper: "Skin Analysis", icon: IconSparkles },
  { label: "Secure & Private", helper: "Your Data, Protected", icon: IconLock },
  {
    label: "Dermatologist Inspired",
    helper: "Cosmetic Guidance",
    icon: IconDroplet,
  },
] as const

const steps = [
  {
    title: "Upload Selfie",
    description: "Take or upload a clear selfie in good lighting",
    icon: IconCamera,
  },
  {
    title: "AI Analysis",
    description: "Our AI analyzes your skin across key cosmetic concerns",
    icon: IconSparkles,
  },
  {
    title: "Get Your Report",
    description: "Receive your personalized skin wellness report",
    icon: IconRosetteDiscountCheck,
  },
  {
    title: "Personalized Picks",
    description: "Discover the perfect Aurora products for you",
    icon: IconDroplet,
  },
] as const

export function PlatformOverview() {
  return (
    <section
      id="how-it-works"
      className="relative border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="-mt-10 grid gap-0 overflow-hidden rounded-lg border border-border bg-card shadow-lg md:grid-cols-5">
          {statItems.map((item) => {
            const StatIcon = item.icon

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 border-b border-border p-6 md:border-r md:border-b-0 last:md:border-r-0"
              >
                <StatIcon
                  className="size-7 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <p className="font-heading text-lg font-semibold text-primary">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.helper}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="py-20 text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Simple Steps to Your Best Skin
          </h2>

          <div className="mt-12 grid gap-7 md:grid-cols-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon

              return (
                <div
                  key={step.title}
                  className="relative rounded-lg border border-border bg-card p-8 shadow-sm"
                >
                  <span className="absolute -top-7 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                    <StepIcon className="size-6" aria-hidden />
                  </span>
                  <span className="mx-auto mt-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
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
