import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency (INR).
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return "₹" + value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Safely resolves a CSS variable color on the client.
 */
export function getThemeColor(variableName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return val || fallback;
}
