import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SignedInHeader from "@/components/SignedInHeader";
import { Analytics } from "@vercel/analytics/next"
import dynamic from "next/dynamic";
import Script from "next/script";

const CookieConsent = dynamic(() => import("@/components/CookieConsent"));

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Makkara",
  url: "https://makkara.chat",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makkara.chat"),
  title: "Makkara \u2013 Chat with Repo | Understand Code with AI",
  description:
    "Makkara lets you explore and understand any GitHub repository through conversation with AI. Ask questions, get examples, and dive into architecture with ease.",
  keywords: [
    "chat with repo",
    "GitHub",
    "AI",
    "code understanding",
    "Makkara",
  ],
  openGraph: {
    title: "Makkara \u2013 Chat with Repo | Understand Code with AI",
    description:
      "Makkara lets you explore and understand any GitHub repository through conversation with AI. Ask questions, get examples, and dive into architecture with ease.",
    url: "https://makkara.chat",
    siteName: "Makkara",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
        >
         
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Analytics />
            <CookieConsent />
            {session?.user && <SignedInHeader user={session.user} />}
            <Toaster />
            {children}
          </ThemeProvider>
         
        </body>
      </SessionProvider>
    </html>
  );
}
