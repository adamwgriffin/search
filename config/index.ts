export * from "./listing_search.config";

export const Locale = process.env.NEXT_PUBLIC_LOCALE || "en-US";

export const Currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export const DefaultSoldInLast = 730; // 2 years in days
