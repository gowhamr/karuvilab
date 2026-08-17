export function getDeviceTier() {
    const mem = navigator.deviceMemory;
    if (mem !== undefined) {
        if (mem <= 4)
            return "low";
        if (mem <= 8)
            return "standard";
        return "desktop";
    }
    const cores = navigator.hardwareConcurrency ?? 4;
    const isNarrowViewport = window.innerWidth < 768;
    if (isNarrowViewport && cores <= 4)
        return "low";
    if (isNarrowViewport && cores > 4)
        return "standard";
    if (!isNarrowViewport && cores <= 4)
        return "standard";
    return "desktop";
}
export function getMaxFileSize(tier) {
    switch (tier) {
        case "low":
            return 50 * 1024 * 1024; // 50 MB
        case "standard":
            return 100 * 1024 * 1024; // 100 MB
        case "desktop":
            return 200 * 1024 * 1024; // 200 MB
    }
}
