"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useIsMobile } from "@/hooks/use-mobile"
import { TelegramBanner } from "@/components/telegram-banner"

export function Header() {
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  return (
    <>
      <TelegramBanner />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">AI</span>
              </span>
              <span className="font-bold text-xl hidden md:inline-block">NameCraft</span>
            </Link>
          </div>

          {isMobile ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          ) : (
            <nav className="flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
              <Link
                href="#generator"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Generator
              </Link>
              <ThemeToggle />
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="container py-4 pb-6 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="#generator"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Generator
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

