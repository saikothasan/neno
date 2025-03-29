"use client"

import { useState } from "react"
import { Check, Copy, Share2, BookmarkPlus, BookmarkCheck, RefreshCw } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface ResultsDisplayProps {
  results: any
  type: "username" | "name" | "both"
  onRegenerate?: () => void
}

export function ResultsDisplay({ results, type, onRegenerate }: ResultsDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<Record<number, boolean>>({})

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast({
      title: "Copied to clipboard",
      description: `"${text}" has been copied to your clipboard.`,
      duration: 2000,
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev }
      newFavorites[index] = !prev[index]

      // Show toast
      if (newFavorites[index]) {
        toast({
          title: "Added to favorites",
          description: "This name has been added to your favorites.",
          duration: 2000,
        })
      } else {
        toast({
          title: "Removed from favorites",
          description: "This name has been removed from your favorites.",
          duration: 2000,
        })
      }

      return newFavorites
    })
  }

  const shareResult = (item: any) => {
    let shareText = ""

    if (type === "both") {
      shareText = `Check out this AI-generated name: ${item.name} (@${item.username}) - Generated with NameCraft AI`
    } else if (type === "username") {
      shareText = `Check out this AI-generated username: @${item.username} - Generated with NameCraft AI`
    } else {
      shareText = `Check out this AI-generated name: ${item.name} - Generated with NameCraft AI`
    }

    // Use clipboard as the primary method instead of navigator.share
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Share text has been copied to your clipboard.",
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err)
        toast({
          title: "Sharing failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
          duration: 2000,
        })
      })
  }

  // Handle the error case from the API
  if (results.warning) {
    // Try to parse the raw response
    let parsedResults = []
    try {
      const rawData = results.rawResponse.response
      parsedResults = JSON.parse(rawData)
    } catch (e) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-destructive">Error Parsing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error parsing the API response.</p>
          </CardContent>
        </Card>
      )
    }

    // Render the parsed results
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              Generated Results
              <Badge variant="outline" className="ml-2">
                {parsedResults.length} results
              </Badge>
            </CardTitle>
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parsedResults.map((item: any, index: number) => (
              <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {type === "both" && (
                        <>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground mt-2">Username</p>
                          <p className="font-medium">@{item.username}</p>
                        </>
                      )}
                      {type === "username" && (
                        <>
                          <p className="text-sm text-muted-foreground">Username</p>
                          <p className="font-medium">@{item.username}</p>
                        </>
                      )}
                      {type === "name" && (
                        <>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{item.name}</p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(
                            type === "both"
                              ? `${item.name} (@${item.username})`
                              : type === "username"
                                ? item.username
                                : item.name,
                            index,
                          )
                        }
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(index)}>
                        {favorites[index] ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => shareResult(item)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there are no results or they're in an unexpected format
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>No results were returned. Please try again with different parameters.</p>
      </CardContent>
    </Card>
  )
}

