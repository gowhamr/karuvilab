import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Formats a number as currency (INR).
 */
export function formatCurrency(value, decimals = 0) {
    return "₹" + value.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}
/**
 * Safely resolves a CSS variable color on the client.
 */
export function getThemeColor(variableName, fallback) {
    if (typeof window === "undefined")
        return fallback;
    const val = window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    return val || fallback;
}
