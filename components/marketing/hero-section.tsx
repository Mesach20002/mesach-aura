import {
  IconArrowRight,
  IconLock,
  IconSparkles,
  IconUserScan,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

import { HeroFeatureItem } from "@/components/marketing/hero-feature-item"
import { SkinScoreCard } from "@/components/marketing/skin-score-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const features = [
  { label: "AI-Powered Analysis", icon: IconSparkles },
  { label: "Personalized Recommendations", icon: IconUserScan },
  { label: "Secure & Private", icon: IconLock },
] as const

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-accent/45 via-background to-background">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20 xl:py-24">
        <div className="min-w-0">
          <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">
            <IconSparkles className="size-3.5" aria-hidden />
            AI-Powered Skin Intelligence
          </Badge>

          <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Discover Your Best Skin with{" "}
            <span className="text-primary">AI-Powered Insights</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Upload a selfie, receive a personalized cosmetic skin analysis, and
            discover suitable Aurora products for healthier, radiant-looking
            skin.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {features.map((feature) => (
              <HeroFeatureItem key={feature.label} {...feature} />
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              data-icon="inline-end"
              className="h-12 w-full rounded-lg px-6 shadow-sm sm:w-auto"
            >
              <Link href="/scan">
                Start Your Skin Scan
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-lg border-primary/25 bg-background/70 px-6 sm:w-auto"
            >
              <Link href="/#how-it-works">Learn How It Works</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Cosmetic wellness guidance only. Not a medical diagnosis.
          </p>
        </div>

        <div className="relative min-w-0">
          <div className="relative aspect-[4/5] min-h-[440px] overflow-hidden rounded-3xl bg-muted shadow-xl sm:min-h-[520px] lg:min-h-[560px]">
            <Image
              src="/images/landing/hero-skin-portrait.png"
              alt="Person with radiant-looking skin using Aurora SkinSense"
              fill
              priority
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/35 to-transparent" />

            <div className="absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-auto">
              <SkinScoreCard />
            </div>
          </div>

          <div className="absolute -top-4 -right-4 -z-10 size-32 rounded-full bg-primary/10 blur-2xl sm:size-48" />
          <div className="absolute -bottom-5 -left-5 -z-10 size-36 rounded-full bg-accent blur-2xl sm:size-52" />
        </div>
      </div>
    </section>
  )
}
