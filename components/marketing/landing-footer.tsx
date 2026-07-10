import Link from "next/link"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconSend,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerGroups = [
  {
    title: "Quick Links",
    links: ["How It Works", "Products", "Skin Analysis", "Blog", "Contact Us"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Affiliates", "Reviews"],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Privacy Policy",
      "Terms of Service",
      "Refund Policy",
      "Contact",
    ],
  },
] as const

const socialIcons = [
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandYoutube,
] as const

export function LandingFooter() {
  return (
    <footer id="about" className="bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_2fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-display text-2xl font-semibold text-primary shadow-sm">
              A
            </span>
            <span>
              <span className="block font-display text-2xl leading-5 font-semibold tracking-widest text-foreground uppercase">
                Aurora
              </span>
              <span className="block text-xs tracking-[0.45em] text-muted-foreground uppercase">
                Skinsense
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
            AI-powered skin analysis and personalized skincare recommendations.
          </p>
          <div className="mt-5 flex gap-3">
            {socialIcons.map((SocialIcon, index) => (
              <span
                key={index}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
              >
                <SocialIcon className="size-4" aria-hidden />
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link href="/" className="hover:text-primary">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div id="blog">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Stay Updated
          </h3>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Subscribe to get skincare tips, offers &amp; updates.
          </p>
          <div className="mt-5 flex gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button size="icon" aria-label="Subscribe">
              <IconSend className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        (c) 2025 Aurora SkinSense. All rights reserved.
      </div>
    </footer>
  )
}
