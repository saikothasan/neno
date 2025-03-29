"use server"

import type { FormValues } from "@/components/generator-form"

export async function generateNames(values: FormValues) {
  try {
    // Build the API URL with query parameters
    const url = new URL("https://userapi.oax.workers.dev/")

    // Add required parameters
    url.searchParams.append("type", values.type)
    url.searchParams.append("count", values.count.toString())
    url.searchParams.append("platform", values.platform)

    // Add optional parameters if they exist
    if (values.theme) {
      url.searchParams.append("theme", values.theme)
    }

    if (values.purpose) {
      url.searchParams.append("purpose", values.purpose)
    }

    // Make the API request with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      const response = await fetch(url.toString(), {
        cache: "no-store",
        next: { revalidate: 0 },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.")
      }
      throw error
    }
  } catch (error) {
    console.error("Error generating names:", error)
    throw error
  }
}

