"use client"

import { useSettingsStore } from "@/src/store/settings/store"
import { AdSenseScript }    from "./AdSenseScript"

export function AdSenseConditional() {
  // Atomic selector only
  const adsConsent = useSettingsStore(s => s.adsConsent)

  if (!adsConsent) return null

  return <AdSenseScript />
}
