import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth/session"

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#products", label: "Products" },
  { href: "/#about", label: "About Us" },
  { href: "/#blog", label: "Blog" },
] as const

export async function LandingNav() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-6">
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

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hidden md:inline-flex"
            >
              <Link href="/reports">Reports</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/scan">Scan</Link>
            </Button>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" size="lg" variant="outline">
                Logout
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/login?redirect=/scan">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
