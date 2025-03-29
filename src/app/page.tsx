import { GeneratorForm } from "@/components/generator-form"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { FaqSection } from "@/components/faq-section"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <div className="container mx-auto px-4 py-12">
            <GeneratorForm />
            <FeaturesSection />
            <FaqSection />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

