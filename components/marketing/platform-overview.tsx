import {
  IconCamera,
  IconDroplet,
  IconRosetteDiscountCheck,
  IconSparkles,
} from "@tabler/icons-react"

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
    <section id="how-it-works" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          How It Works
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-foreground md:text-5xl">
          Simple Steps to Your Best Skin
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon

            return (
              <div
                key={step.title}
                className="relative rounded-2xl bg-card p-7 pt-9 shadow-sm ring-1 ring-border"
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
    </section>
  )
}
