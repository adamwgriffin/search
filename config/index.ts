export * from "./listing_search.config";

export const Locale = process.env.NEXT_PUBLIC_LOCALE || "en-US";

export const Currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export const SearchPathname = "/";

export const DefaultSearchParams = {
  address: "Fremont, Seattle, WA, USA",
  place_id: "ChIJ1WmlZawVkFQRmE1TlcKlxaI",
  address_types: "geocode,neighborhood,political"
} as const;

export const AuthPathRegex = /^\/account(\/|$)/;
