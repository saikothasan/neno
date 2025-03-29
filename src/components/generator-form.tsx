"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Info, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateNames } from "@/lib/actions"
import { ResultsDisplay } from "@/components/results-display"
import { HistoryDisplay } from "@/components/history-display"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  type: z.enum(["username", "name", "both"], {
    required_error: "Please select what to generate",
  }),
  count: z.coerce.number().min(1).max(10).default(3),
  platform: z.string().min(1, {
    message: "Please select a platform",
  }),
  theme: z.string().optional(),
  purpose: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

const platforms = [
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitch", label: "Twitch" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "reddit", label: "Reddit" },
  { value: "discord", label: "Discord" },
  { value: "blog", label: "Blog" },
  { value: "dating", label: "Dating Site" },
  { value: "gaming", label: "Gaming" },
  { value: "other", label: "Other" },
]

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
]

export function GeneratorForm() {
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("generator")
  const [history, setHistory] = useState<any[]>([])

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
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const data = await generateNames(values)
      setResults(data)
      saveToHistory(data, values)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate names")
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select theme (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
    </section>
  )
}

