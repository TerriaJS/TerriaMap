import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes
 * Used by ShadCN components to combine className props
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
