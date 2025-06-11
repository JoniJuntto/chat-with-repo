
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { setCookieConsent, getCookieConsent } from "@/app/lib/cookies";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent({ necessary: true, analytics: true, marketing: true });
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setCookieConsent({ necessary: true, analytics: false, marketing: false });
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowPreferences(true);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Cookie Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We use cookies required for authentication and Analytics.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button onClick={handleAcceptAll} className="flex-1">Accept All</Button>
            <Button onClick={handleRejectAll} variant="outline" className="flex-1">Reject All</Button>
          </div>
          <Button onClick={handleCustomize} variant="ghost" size="sm" className="w-full">
            Customize
          </Button>
        </CardFooter>
      </Card>

      {showPreferences && (
        <CookiePreferences
          onClose={() => setShowPreferences(false)}
          onSave={() => {
            setShowPreferences(false);
            setShowBanner(false);
          }}
        />
      )}
    </div>
  );
}

function CookiePreferences({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  const handleSave = () => {
    setCookieConsent(preferences);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Cookie Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Necessary</p>
                <p className="text-sm text-muted-foreground">Required for basic functionality</p>
              </div>
              <input type="checkbox" checked={preferences.necessary} disabled className="h-4 w-4" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">Help us improve our service</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    analytics: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing</p>
                <p className="text-sm text-muted-foreground">Personalized content and ads</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    marketing: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">Save Preferences</Button>
          <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
