import { Sparkles, Repeat, Share2, BookmarkCheck, Layers, ShieldCheck } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      name: "AI-Powered Generation",
      description: "Our advanced AI algorithms create unique, contextually appropriate names for any platform.",
      icon: Sparkles,
    },
    {
      name: "Platform Specific",
      description:
        "Tailored suggestions optimized for different platforms like Twitter, LinkedIn, Instagram, and more.",
      icon: Layers,
    },
    {
      name: "Unlimited Regeneration",
      description: "Not satisfied? Generate as many options as you need until you find the perfect match.",
      icon: Repeat,
    },
    {
      name: "Save Favorites",
      description: "Keep track of names you like with our built-in favorites system for easy reference.",
      icon: BookmarkCheck,
    },
    {
      name: "Easy Sharing",
      description: "Share your favorite generated names directly to social media or via link.",
      icon: Share2,
    },
    {
      name: "Privacy First",
      description: "We never store your generated names or personal information without your consent.",
      icon: ShieldCheck,
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Powerful Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for perfect names</p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our AI name generator combines advanced technology with user-friendly features to help you create the
            perfect username or name for any purpose.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

