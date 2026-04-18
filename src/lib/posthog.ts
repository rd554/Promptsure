"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
    });
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(event, properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.identify(userId, traits);
  }
}

export default posthog;
