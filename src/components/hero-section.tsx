import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/5 sm:-mr-80 lg:-mr-96" />
      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            AI-Powered Name Generation
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Create unique, platform-specific usernames and names instantly with our advanced AI generator. Perfect for
            social media, gaming, professional profiles, and more.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="#generator">
              <Button size="lg" className="gap-2">
                Try it now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

