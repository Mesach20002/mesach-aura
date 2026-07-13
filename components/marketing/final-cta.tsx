import Image from "next/image"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="bg-primary/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[180px_1fr_auto] md:items-center lg:px-8">
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg md:block">
          <Image
            src="/images/landing/skincare-products-lineup.png"
            alt="Aurora skincare products"
            fill
            sizes="180px"
            className="object-cover"
          />
        </div>
        <div className="text-primary-foreground">
          <h2 className="font-display text-4xl font-semibold">
            Ready to Transform Your Skin?
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Join millions who trust Aurora SkinSense for their skincare journey.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" data-icon="inline-end">
          <Link href="/scan">
            Start Your Skin Scan
            <IconArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  )
}
