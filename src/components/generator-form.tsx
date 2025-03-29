"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Info, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResultsDisplay } from "@/components/results-display"
import { HistoryDisplay } from "@/components/history-display"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
  type: z.enum(["username", "name", "both"], {
    required_error: "Please select what to generate",
  }),
  count: z.coerce.number().min(1).max(10).default(3),
  platform: z.string().min(1, {
    message: "Please select a platform",
  }),
  customPlatform: z.string().optional(),
  theme: z.string().optional(),
  purpose: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

// Define the error response type
interface ErrorResponse {
  error?: string
  message?: string
}

// Expanded platforms list organized by categories
const platforms = [
  // Social Media
  { value: "twitter", label: "Twitter/X", category: "Social Media" },
  { value: "instagram", label: "Instagram", category: "Social Media" },
  { value: "facebook", label: "Facebook", category: "Social Media" },
  { value: "tiktok", label: "TikTok", category: "Social Media" },
  { value: "snapchat", label: "Snapchat", category: "Social Media" },
  { value: "pinterest", label: "Pinterest", category: "Social Media" },
  { value: "linkedin", label: "LinkedIn", category: "Social Media" },
  { value: "threads", label: "Threads", category: "Social Media" },
  { value: "mastodon", label: "Mastodon", category: "Social Media" },

  // Gaming
  { value: "twitch", label: "Twitch", category: "Gaming" },
  { value: "steam", label: "Steam", category: "Gaming" },
  { value: "xbox", label: "Xbox", category: "Gaming" },
  { value: "playstation", label: "PlayStation", category: "Gaming" },
  { value: "nintendo", label: "Nintendo", category: "Gaming" },
  { value: "discord", label: "Discord", category: "Gaming" },
  { value: "epicgames", label: "Epic Games", category: "Gaming" },
  { value: "roblox", label: "Roblox", category: "Gaming" },
  { value: "minecraft", label: "Minecraft", category: "Gaming" },

  // Professional
  { value: "github", label: "GitHub", category: "Professional" },
  { value: "gitlab", label: "GitLab", category: "Professional" },
  { value: "stackoverflow", label: "Stack Overflow", category: "Professional" },
  { value: "medium", label: "Medium", category: "Professional" },
  { value: "dev", label: "Dev.to", category: "Professional" },
  { value: "behance", label: "Behance", category: "Professional" },
  { value: "dribbble", label: "Dribbble", category: "Professional" },

  // Content & Entertainment
  { value: "youtube", label: "YouTube", category: "Content & Entertainment" },
  { value: "vimeo", label: "Vimeo", category: "Content & Entertainment" },
  { value: "spotify", label: "Spotify", category: "Content & Entertainment" },
  { value: "soundcloud", label: "SoundCloud", category: "Content & Entertainment" },
  { value: "podcast", label: "Podcast", category: "Content & Entertainment" },
  { value: "substack", label: "Substack", category: "Content & Entertainment" },

  // Community & Forums
  { value: "reddit", label: "Reddit", category: "Community & Forums" },
  { value: "quora", label: "Quora", category: "Community & Forums" },
  { value: "forum", label: "Forums", category: "Community & Forums" },

  // Other
  { value: "blog", label: "Blog", category: "Other" },
  { value: "dating", label: "Dating Site", category: "Other" },
  { value: "email", label: "Email", category: "Other" },
  { value: "custom", label: "Custom Platform...", category: "Other" },
]

// Group platforms by category
const platformCategories = platforms.reduce(
  (acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = []
    }
    acc[platform.category].push(platform)
    return acc
  },
  {} as Record<string, typeof platforms>,
)

// Get category names in order
const categoryNames = Object.keys(platformCategories).sort((a, b) => {
  // Ensure "Other" is always last
  if (a === "Other") return 1
  if (b === "Other") return -1
  return a.localeCompare(b)
})

const themes = [
  { value: "tech", label: "Technology" },
  { value: "creative", label: "Creative" },
  { value: "professional", label: "Professional" },
  { value: "gaming", label: "Gaming" },
  { value: "funny", label: "Funny" },
  { value: "cute", label: "Cute" },
  { value: "nature", label: "Nature" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "minimalist", label: "Minimalist" },
  { value: "retro", label: "Retro" },
  { value: "futuristic", label: "Futuristic" },
  { value: "fantasy", label: "Fantasy" },
  { value: "sci-fi", label: "Sci-Fi" },
]

const purposes = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "art_portfolio", label: "Art Portfolio" },
  { value: "writing", label: "Writing" },
  { value: "dating_profile", label: "Dating Profile" },
  { value: "gaming", label: "Gaming" },
  { value: "streaming", label: "Streaming" },
  { value: "professional_networking", label: "Professional Networking" },
  { value: "content_creation", label: "Content Creation" },
  { value: "community_building", label: "Community Building" },
  { value: "education", label: "Education" },
  { value: "activism", label: "Activism" },
  { value: "fan_account", label: "Fan Account" },
]

export function GeneratorForm() {
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("generator")
  const [history, setHistory] = useState<any[]>([])
  const [customPlatformDialogOpen, setCustomPlatformDialogOpen] = useState(false)
  const [customPlatformValue, setCustomPlatformValue] = useState("")

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("nameGeneratorHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
  }, [])

  // Save results to history
  const saveToHistory = (newResults: any, formValues: FormValues) => {
    try {
      let parsedResults = []
      if (newResults.warning) {
        const rawData = newResults.rawResponse.response
        parsedResults = JSON.parse(rawData)
      } else {
        parsedResults = newResults
      }

      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        results: parsedResults,
        params: formValues,
      }

      const updatedHistory = [historyItem, ...history].slice(0, 20) // Keep only the last 20 items
      setHistory(updatedHistory)
      localStorage.setItem("nameGeneratorHistory", JSON.stringify(updatedHistory))
    } catch (e) {
      console.error("Failed to save to history:", e)
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "username",
      count: 3,
      platform: "twitter",
      customPlatform: "",
      theme: "",
      purpose: "",
    },
  })

  // Watch the platform value to handle custom platform selection
  const selectedPlatform = form.watch("platform")

  useEffect(() => {
    if (selectedPlatform === "custom") {
      setCustomPlatformDialogOpen(true)
    }
  }, [selectedPlatform])

  // Handle custom platform submission
  const handleCustomPlatformSubmit = () => {
    if (customPlatformValue.trim()) {
      form.setValue("customPlatform", customPlatformValue.trim())
      setCustomPlatformDialogOpen(false)
    } else {
      toast({
        title: "Error",
        description: "Please enter a platform name",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare the data for the API
      const apiValues = { ...values }

      // If custom platform is selected, use the custom platform value
      if (values.platform === "custom" && values.customPlatform) {
        apiValues.platform = values.customPlatform
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiValues),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse
        const errorMessage = errorData.error || errorData.message || "Failed to generate names"
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setResults(data)
      saveToHistory(data, values)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate names"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="generator" className="space-y-8 scroll-mt-16">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Generate Your Perfect Name</h2>
        <p className="text-muted-foreground">
          Customize your generation parameters and let our AI create the perfect username or name for you.
        </p>
      </div>

      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-6">
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Name Generator
              </CardTitle>
              <CardDescription>Configure your preferences and generate unique names</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Generate</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select what to generate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="username">Usernames</SelectItem>
                              <SelectItem value="name">Names</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform">
                                  {field.value === "custom" && form.getValues().customPlatform
                                    ? form.getValues().customPlatform
                                    : platforms.find((p) => p.value === field.value)?.label || "Select platform"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {categoryNames.map((category) => (
                                <SelectGroup key={category}>
                                  <SelectLabel>{category}</SelectLabel>
                                  {platformCategories[category].map((platform) => (
                                    <SelectItem key={platform.value} value={platform.value}>
                                      {platform.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Count
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Number of names to generate (1-10)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={10} {...field} />
                          </FormControl>
                          <FormDescription>Generate 1-10 results</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Theme
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Optional theme to influence the style of generated names</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select theme (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="no_theme">No theme</SelectItem>
                              {themes.map((theme) => (
                                <SelectItem key={theme.value} value={theme.value}>
                                  {theme.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Purpose
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Optional purpose to further refine the generated names</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="no_purpose">No specific purpose</SelectItem>
                              {purposes.map((purpose) => (
                                <SelectItem key={purpose.value} value={purpose.value}>
                                  {purpose.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: form.getValues().count }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2 w-full">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-6 w-3/4" />
                              {form.getValues().type === "both" && (
                                <>
                                  <Skeleton className="h-4 w-16 mt-2" />
                                  <Skeleton className="h-6 w-1/2" />
                                </>
                              )}
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-md bg-destructive/15 p-4 text-destructive">
              <p className="font-medium">Error generating names</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {results && !isLoading && (
            <div className="mt-8">
              <ResultsDisplay
                results={results}
                type={form.getValues().type}
                onRegenerate={() => form.handleSubmit(onSubmit)()}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryDisplay history={history} setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>

      {/* Custom Platform Dialog */}
      <Dialog
        open={customPlatformDialogOpen}
        onOpenChange={(open) => {
          if (!open && !form.getValues().customPlatform) {
            // If dialog is closed without setting a custom platform, reset to default
            form.setValue("platform", "twitter")
          }
          setCustomPlatformDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Custom Platform</DialogTitle>
            <DialogDescription>Provide the name of the platform you want to generate names for</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Clubhouse, Bluesky, Patreon..."
              value={customPlatformValue}
              onChange={(e) => setCustomPlatformValue(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                form.setValue("platform", "twitter")
                setCustomPlatformDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCustomPlatformSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

