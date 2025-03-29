"use client"

import { useState } from "react"
import Link from "next/link"
import { BellIcon as BrandTelegram, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TelegramBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary/10 py-2 px-4 text-sm flex items-center justify-center relative">
      <BrandTelegram className="h-4 w-4 mr-2 text-primary" />
      <span>Join our Telegram community:</span>
      <Link
        href="https://t.me/drkingbd"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary hover:underline ml-1"
      >
        t.me/drkingbd
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

