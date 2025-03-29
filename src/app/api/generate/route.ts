import { type NextRequest, NextResponse } from "next/server"

// Use the Edge Runtime for better performance
export const runtime = "edge"

// Define the expected request body type
interface GenerateRequest {
  type: "username" | "name" | "both"
  count: number
  platform: string
  theme?: string
  purpose?: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body with type assertion
    const values = (await request.json()) as GenerateRequest

    // Validate required fields
    if (!values.type || !values.platform || typeof values.count !== "number") {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

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
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: `API request failed with status ${response.status}` },
          { status: response.status },
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return NextResponse.json({ error: "Request timed out. Please try again." }, { status: 408 })
      }

      // Handle other fetch errors
      return NextResponse.json({ error: "Failed to connect to name generation service" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error generating names:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 400 })
  }
}

