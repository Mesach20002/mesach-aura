"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBell,
  IconCamera,
  IconFileDescription,
  IconHome,
  IconLogout,
  IconMenu2,
  IconMessageCircle,
  IconSettings,
  IconSparkles,
  IconUserCircle,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AuthUser } from "@/lib/auth/types"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/scan", label: "New Skin Scan", icon: IconCamera },
  { href: "/reports", label: "My Reports", icon: IconFileDescription },
  {
    href: "/dashboard#aurora-ai-assistant",
    label: "Aurora AI Chat",
    icon: IconMessageCircle,
  },
  { href: "/account", label: "Aurora Account", icon: IconUserCircle },
  { href: "/settings", label: "Settings", icon: IconSettings },
] as const

interface DashboardLayoutProps {
  children: React.ReactNode
  user: AuthUser
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const displayName = user.name || user.email
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh">
        <aside className="sticky top-0 hidden h-svh w-[280px] shrink-0 flex-col border-r border-border bg-card shadow-sm lg:flex print:hidden">
          <DashboardBrand />
          <DashboardNav pathname={pathname} />
          <div className="mt-auto border-t border-border p-4">
            <form action="/api/auth/logout" method="post">
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start"
                data-icon="inline-start"
              >
                <IconLogout className="size-4" aria-hidden />
                Logout
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur print:hidden">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <MobileNav pathname={pathname} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    Aurora Account
                  </p>
                  <h1 className="truncate font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    {getGreeting()}, {getFirstName(displayName)}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Notifications"
                >
                  <IconBell className="size-4" aria-hidden />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-3 px-3"
                      aria-label="Open Aurora Account menu"
                    >
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
                        {initial}
                      </span>
                      <span className="hidden max-w-32 truncate text-left sm:inline">
                        {displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuLabel>Aurora Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/account">Account details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action="/api/auth/logout" method="post">
                      <DropdownMenuItem asChild>
                        <button type="submit" className="w-full">
                          Logout
                        </button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

function DashboardBrand() {
  return (
    <Link
      href="/dashboard"
      className="flex h-20 items-center gap-3 border-b border-border px-6"
    >
      <span className="flex size-11 items-center justify-center rounded-lg bg-primary font-display text-lg font-semibold text-primary-foreground">
        A
      </span>
      <span>
        <span className="block font-heading text-sm font-semibold tracking-widest text-foreground uppercase">
          Aurora
        </span>
        <span className="block text-xs text-muted-foreground">
          SkinSense Dashboard
        </span>
      </span>
    </Link>
  )
}

function DashboardNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="Dashboard">
      {navItems.map((item: any) => {
        const Icon = item.icon
        const baseHref = item.href.split("#")[0]
        const isActive =
          pathname === baseHref || pathname.startsWith(`${baseHref}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" aria-label="Menu">
          <IconMenu2 className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="rounded-lg">
        <DropdownMenuLabel>Aurora Dashboard</DropdownMenuLabel>
        {navItems.map((item: any) => {
          const Icon = item.icon
          const baseHref = item.href.split("#")[0]
          const isActive =
            pathname === baseHref || pathname.startsWith(`${baseHref}/`)

          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(isActive ? "text-foreground" : undefined)}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <form action="/api/auth/logout" method="post">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <IconLogout className="size-4" aria-hidden />
              Logout
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Good Morning"
  }

  if (hour < 18) {
    return "Good Afternoon"
  }

  return "Good Evening"
}

function getFirstName(value: string): string {
  return value.split(" ")[0] || value
}
