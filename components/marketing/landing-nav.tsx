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
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-display text-xl font-semibold text-primary shadow-sm sm:size-11 sm:text-2xl">
            A
          </span>
          <span>
            <span className="block font-display text-lg leading-5 font-semibold tracking-widest text-foreground uppercase sm:text-2xl">
              Aurora
            </span>
            <span className="hidden text-xs tracking-[0.45em] text-muted-foreground uppercase sm:block">
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
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
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
            <Button asChild size="sm" className="sm:h-10 sm:px-4">
              <Link href="/scan">Scan</Link>
            </Button>
            <form action="/api/auth/logout" method="post">
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hidden md:inline-flex"
            >
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild size="sm" className="sm:h-10 sm:px-4">
              <Link href="/scan">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
