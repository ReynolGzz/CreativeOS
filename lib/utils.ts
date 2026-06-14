import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(n: number) {
  return n.toLocaleString();
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export const AD_TYPE_LABELS: Record<string, string> = {
  PROBLEM_SOLUTION: "Problem/Solution",
  LUXURY_PREMIUM: "Luxury/Premium",
  SOCIAL_PROOF: "Social Proof",
  OFFER_DISCOUNT: "Offer/Discount",
  BEFORE_AFTER: "Before/After",
  UGC_STYLE: "UGC Style",
  MINIMAL_PRODUCT: "Minimal Product",
  LIFESTYLE: "Lifestyle",
  COMPARISON: "Comparison",
  URGENCY_FOMO: "Urgency/FOMO",
};

export const CREDIT_COSTS = {
  ANALYZE_PRODUCT: 1,
  GENERATE_STRATEGY: 2,
  GENERATE_IMAGE: 5,
  GENERATE_FULL_PACK: 50,
  ANALYZE_COMPETITOR: 10,
} as const;
