import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "NameCraft - Generate Perfect Usernames & Names",
    template: "%s | NameCraft",
  },
  description:
    "AI-powered username and name generator for social media, gaming, professional profiles, and more. Create unique, platform-specific names instantly.",
  keywords: [
    "username generator",
    "name generator",
    "AI username",
    "social media names",
    "gaming username",
    "professional name",
    "unique username",
  ],
  authors: [{ name: "NameCraft" }],
  creator: "NameCraft",
  publisher: "NameCraft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://namecraft.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NameCraft - Generate Perfect Usernames & Names",
    description: "AI-powered username and name generator for social media, gaming, professional profiles, and more.",
    url: "https://namecraft.pages.dev",
    siteName: "NameCraft",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NameCraft - Username Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NameCraft - Generate Perfect Usernames & Names",
    description: "AI-powered username and name generator for social media, gaming, professional profiles, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_ID",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

