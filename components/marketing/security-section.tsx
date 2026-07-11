import {
  IconButterfly,
  IconDroplet,
  IconFlask,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react"

const trustItems = [
  {
    title: "Science Backed",
    description: "Formulated with proven ingredients and research",
    icon: IconFlask,
  },
  {
    title: "Dermatologist Inspired",
    description: "Developed with expert skincare knowledge",
    icon: IconRosetteDiscountCheck,
  },
  {
    title: "Clean & Safe",
    description: "No harsh chemicals, paraben-free",
    icon: IconDroplet,
  },
  {
    title: "Cruelty Free",
    description: "We love animals, just like you do",
    icon: IconButterfly,
  },
] as const

export function SecuritySection() {
  return (
    <section id="features" className="border-b border-border bg-primary/10">
      <div className="mx-auto grid max-w-7xl gap-0 px-6 py-8 md:grid-cols-4">
        {trustItems.map((item) => {
          const TrustIcon = item.icon

          return (
            <div
              key={item.title}
              className="flex items-start gap-4 border-b border-border py-5 md:border-r md:border-b-0 md:px-8 last:md:border-r-0"
            >
              <TrustIcon className="size-8 shrink-0 text-primary" aria-hidden />
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
