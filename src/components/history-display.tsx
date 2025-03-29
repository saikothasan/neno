"use client"

import { useState } from "react"
import { Trash2, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface HistoryDisplayProps {
  history: any[]
  setActiveTab: (tab: string) => void
}

export function HistoryDisplay({ history, setActiveTab }: HistoryDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const clearHistory = () => {
    localStorage.removeItem("nameGeneratorHistory")
    window.location.reload()
    toast({
      title: "History cleared",
      description: "Your generation history has been cleared.",
      duration: 2000,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "username":
        return "Usernames"
      case "name":
        return "Names"
      case "both":
        return "Names & Usernames"
      default:
        return type
    }
  }

  const getPlatformLabel = (platform: string) => {
    const platformMap: Record<string, string> = {
      twitter: "Twitter/X",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      twitch: "Twitch",
      youtube: "YouTube",
      github: "GitHub",
      reddit: "Reddit",
      discord: "Discord",
      blog: "Blog",
      dating: "Dating",
      gaming: "Gaming",
    }

    return platformMap[platform] || platform
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generation History</CardTitle>
          <CardDescription>Your generation history will appear here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">You haven't generated any names yet.</p>
          <Button variant="default" className="mt-4" onClick={() => setActiveTab("generator")}>
            Go to Generator
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Generation History</h3>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Trash2 className="h-3.5 w-3.5" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your entire generation history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory}>Clear History</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="h-[600px] rounded-md">
        <div className="space-y-4 pr-4">
          {history.map((item) => (
            <Card key={item.id} className="border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {getTypeLabel(item.params.type)} for {getPlatformLabel(item.params.platform)}
                    </CardTitle>
                    <CardDescription>{formatDate(item.timestamp)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {item.params.theme && <Badge variant="outline">{item.params.theme}</Badge>}
                    {item.params.purpose && <Badge variant="outline">{item.params.purpose.replace("_", " ")}</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.results.slice(0, 4).map((result: any, idx: number) => (
                    <div key={idx} className="border rounded-md p-2 text-sm">
                      {item.params.type === "both" && (
                        <>
                          <div className="text-xs text-muted-foreground">Name</div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">Username</div>
                          <div className="font-medium">@{result.username}</div>
                        </>
                      )}
                      {item.params.type === "username" && (
                        <>
                          <div className="text-xs text-muted-foreground">Username</div>
                          <div className="font-medium">@{result.username}</div>
                        </>
                      )}
                      {item.params.type === "name" && (
                        <>
                          <div className="text-xs text-muted-foreground">Name</div>
                          <div className="font-medium">{result.name}</div>
                        </>
                      )}
                    </div>
                  ))}
                  {item.results.length > 4 && (
                    <div className="border rounded-md p-2 text-sm flex items-center justify-center text-muted-foreground">
                      +{item.results.length - 4} more
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto gap-1" onClick={() => setActiveTab("generator")}>
                  Generate Similar
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

