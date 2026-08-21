export type DeviceTier = "low" | "standard" | "desktop";

export function getDeviceTier(
  overrideNav?: { deviceMemory?: number; hardwareConcurrency?: number },
  overrideWidth?: number
): DeviceTier {
  const nav = overrideNav || (typeof navigator !== 'undefined' ? navigator : undefined);
  const mem = (nav as any)?.deviceMemory as number | undefined;
  if (mem !== undefined) {
    if (mem <= 4) return "low";
    if (mem <= 8) return "standard";
    return "desktop";
  }

  const cores = nav?.hardwareConcurrency ?? (typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 4) ?? 4;
  const width = overrideWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isNarrowViewport = width < 768;

  if (isNarrowViewport && cores <= 4) return "low";
  if (isNarrowViewport && cores > 4) return "standard";
  if (!isNarrowViewport && cores <= 4) return "standard";
  return "desktop";
}

export function getMaxFileSize(tier: DeviceTier): number {
  switch (tier) {
    case "low":
      return 50 * 1024 * 1024; // 50 MB
    case "standard":
      return 100 * 1024 * 1024; // 100 MB
    case "desktop":
      return 200 * 1024 * 1024; // 200 MB
  }
}
