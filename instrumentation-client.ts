// lib/analytics.ts
import posthog from "posthog-js";
import { getCookieConsent } from "@/app/lib/cookies";

let analyticsInitialized = false;

export function initializeAnalytics(): void {
  if (typeof window === "undefined" || analyticsInitialized) return;

  const consent = getCookieConsent();
  
  // Initialize PostHog with consent-aware settings
  posthog.init("phc_I9NkJWrdMWeUf3gE8ny344FdVpI008GKQfDIEjd1SWn", {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    capture_pageview: consent?.analytics ? "history_change" : false,
    capture_pageleave: consent?.analytics || false,
    capture_exceptions: consent?.analytics || false,
    debug: process.env.NODE_ENV === "development",
    opt_out_capturing_by_default: !consent?.analytics,
    persistence: consent?.analytics ? "localStorage+cookie" : "memory",
  });

  // Initialize Vercel Analytics if consent given
  if (consent?.analytics) {
    import("@vercel/analytics").then(({ inject }) => {
      inject();
    });
  }

  analyticsInitialized = true;

  // Listen for consent changes
  window.addEventListener("cookieConsentChanged", handleConsentChange);
}

function handleConsentChange(event: Event): void {
  const consent = (event as CustomEvent).detail;

  if (consent.analytics) {
    // Enable analytics
    posthog.opt_in_capturing();
    
    // Initialize Vercel Analytics if not already done
    import("@vercel/analytics").then(({ inject }) => {
      inject();
    });
  } else {
    // Disable analytics
    posthog.opt_out_capturing();
    posthog.reset();
  }
}

// Utility functions for tracking
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  const consent = getCookieConsent();
  if (consent?.analytics) {
    posthog.capture(eventName, properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, any>): void {
  const consent = getCookieConsent();
  if (consent?.analytics) {
    posthog.identify(userId, traits);
  }
}