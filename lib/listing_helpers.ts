import type {
  Listing,
  ListingDetail,
  ListingAddress
} from '../types/listing_types'
import { Locale, Currency } from '../config'

export interface FormatPriceOptions {
  numberFormatOptions?: Intl.NumberFormatOptions
  displayInterval?: boolean
}

const SQFT_PER_ACRE = 43560

export const LongCurrencyFormat: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: Currency,
  maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
}

export const ShortCurrencyFormat: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: Currency,
  notation: 'compact'
}

/** @example
 * 3_250_000 => '$3.25M' */
export const AbbreviatedCurrencyFormat: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  roundingMode: 'floor',
  roundingPriority: 'morePrecision'
}

export const ShortDateFormat: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
  year: 'numeric'
}

export const LongDateFormat: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}

export const DefaultTimeFormat: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
}

const defaultFormatPriceOptions: FormatPriceOptions = {
  numberFormatOptions: LongCurrencyFormat,
  displayInterval: true
}

export const formatPrice = (
  price: number,
  rental: boolean,
  options: FormatPriceOptions = defaultFormatPriceOptions
) => {
  const opts = { ...defaultFormatPriceOptions, ...options }
  const priceFormatted = Intl.NumberFormat(
    Locale,
    opts.numberFormatOptions
  ).format(Number(price))
  return opts.displayInterval && rental
    ? `${priceFormatted}/mo`
    : priceFormatted
}

export const formatAbbreviatedPrice = (price: number) => {
  const format =
    price >= 1_000_000 ? AbbreviatedCurrencyFormat : LongCurrencyFormat
  return Intl.NumberFormat(Locale, format).format(price)
}

export const formatPriceFromListing = (
  { soldPrice, listPrice, rental }: Listing | ListingDetail,
  options: FormatPriceOptions = {}
) => formatPrice(soldPrice || listPrice, Boolean(rental), options)

export const formatSoldDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(Locale, ShortDateFormat)

export const formatOpenHouseDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(Locale, LongDateFormat)

export const formatOpenHouseTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString(Locale, DefaultTimeFormat)

export const getBathrooms = (listing: Listing | ListingDetail): number => {
  return listing.baths || 0
}

export const formatSqft = ({ sqft }: Listing | ListingDetail) =>
  sqft?.toLocaleString(Locale)

export const formatLotSize = (sqft: number) => {
  if (sqft >= SQFT_PER_ACRE) {
    const acres = sqft / SQFT_PER_ACRE
    const label = acres > 1 ? "acres" : "acre";
    return (
      acres.toLocaleString(Locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ` ${label}`
    )
  }
  return sqft.toLocaleString(Locale) + ' sqft'
}

export const cityStateZip = (location: ListingAddress) => {
  const { city, state, zip } = location
  return [city.trim(), `${state} ${zip}`.trim()].filter((a) => a).join(', ')
}

export const listingLocationToLatLngLiteral = (
  listing: Listing
): google.maps.LatLngLiteral => {
  return {
    lat: listing?.latitude,
    lng: listing?.longitude
  }
}

/**
 * Sort listings by latitude and longitude in descending order. Sort latitude
 * first (descending is East to West), then longitude (descending order is East
 * to West)
 */
export function sortListingsByLatLng(listings: Listing[]) {
  return listings.toSorted((a, b) => {
    // Sort by longitude if latitude was already sorted
    if (a.latitude === b.latitude) {
      return b.longitude - a.longitude
    }
    // Sort by latitude first.
    return b.latitude - a.latitude
  })
}
