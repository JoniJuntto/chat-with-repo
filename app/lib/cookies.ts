// lib/cookies.ts
export interface CookieConsent {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp?: number;
  }
  
  const COOKIE_NAME = "cookie-consent";
  const COOKIE_EXPIRY_DAYS = 365;
  
  export function setCookieConsent(consent: CookieConsent): void {
    const consentWithTimestamp = {
      ...consent,
      timestamp: Date.now(),
    };
  
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
  
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(
      consentWithTimestamp
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
    // Trigger analytics initialization based on consent
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookieConsentChanged", { detail: consent })
      );
    }
  }
  
  export function getCookieConsent(): CookieConsent | null {
    if (typeof document === "undefined") return null;
  
    const cookies = document.cookie.split(";");
    const consentCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
  
    if (!consentCookie) return null;
  
    try {
      const consentValue = consentCookie.split("=")[1];
      return JSON.parse(decodeURIComponent(consentValue));
    } catch {
      return null;
    }
  }
  
  export function clearCookieConsent(): void {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }