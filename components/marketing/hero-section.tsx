import Image from "next/image"
import Link from "next/link"
import {
  IconArrowRight,
  IconHeart,
  IconLock,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconSparkles,
  IconUserScan,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const trustItems = [
  { label: "AI-Powered Analysis", icon: IconSparkles },
  { label: "Personalized Recommendations", icon: IconUserScan },
  { label: "100% Secure & Private", icon: IconShieldCheck },
] as const

const concernCards = [
  { label: "Pores", band: "High" },
  { label: "Hydration", band: "Moderate" },
  { label: "Redness", band: "Low" },
] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary/5">
      <div className="mx-auto grid min-h-[640px] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-0">
        <div className="relative z-10 space-y-8">
          <div className="space-y-6">
            <h1 className="max-w-3xl font-display text-5xl leading-tight font-semibold text-foreground md:text-7xl">
              Discover Your Best Skin with{" "}
              <span className="text-primary">AI-Powered Insights</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-foreground/80">
              Upload a selfie, get a personalized cosmetic skin analysis, and
              discover the right Aurora products for healthy, radiant skin.
            </p>
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {trustItems.map((item: any) => {
              const TrustIcon = item.icon

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <TrustIcon className="size-5 text-primary" aria-hidden />
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" data-icon="inline-end" className="px-8">
              <Link href="/login?redirect=/scan">
                Start Your Skin Scan
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">
                Learn How It Works
                <span className="ml-2 flex size-6 items-center justify-center rounded-full border border-primary text-primary">
                  <IconArrowRight className="size-3" aria-hidden />
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-lg lg:rounded-none">
          <Image
            src="/images/landing/hero-skin-portrait.png"
            alt="Aurora SkinSense beauty portrait"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-center"
          />

          <div className="absolute top-12 right-4 rounded-lg border border-border bg-background/95 p-5 shadow-lg backdrop-blur">
            <p className="text-sm font-medium text-foreground">
              Your Skin Score
            </p>
            <div className="mt-4 flex size-28 items-center justify-center rounded-full border-8 border-primary/30">
              <div className="text-center">
                <p className="font-heading text-3xl font-semibold text-foreground">
                  82
                </p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
              <IconRosetteDiscountCheck
                className="size-4 text-primary"
                aria-hidden
              />
              Healthy Glow
            </p>
          </div>

          <div className="absolute right-0 bottom-10 w-56 rounded-lg border border-border bg-background/95 p-5 shadow-lg backdrop-blur">
            <p className="text-sm font-medium text-foreground">Skin Concerns</p>
            <div className="mt-4 space-y-3">
              {concernCards.map((concern) => (
                <div
                  key={concern.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconHeart className="size-4 text-primary" aria-hidden />
                    {concern.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 px-2 py-1 text-primary"
                  >
                    {concern.band}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 left-8 hidden size-72 -translate-y-1/2 rounded-full border border-primary/20 lg:block" />
          <div className="absolute bottom-8 left-8 hidden size-3 rounded-full bg-background shadow-lg lg:block" />
          <IconLock
            className="absolute bottom-8 left-14 hidden size-4 text-primary lg:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
