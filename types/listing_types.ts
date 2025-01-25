import {
  MultiPolygon,
  ViewportLatLngBounds
} from '../store/listingMap/listingMapTypes'
import type { PropertyType } from '../lib/property_types'

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented'

export interface ListingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
}

export interface PhotoGalleryImage {
  _id: string
  url: string
  caption?: string
}

export interface SubFeature {
  subfeature_name: string
  subfeatureid: number
}

export interface Feature {
  feature_name: string
  feature_description?: string
  featureid: number
  subfeatures: SubFeature[]
}

export interface PropertDetail {
  _id: string
  name: string
  details: string[]
}

export interface PropertDetailsSection {
  _id: string
  name: string
  description?: string
  details: PropertDetail[]
}

export interface OpenHouse {
  start: string
  end: string
  comments?: string
}

export interface Listing {
  _id: string
  status: PropertyStatus
  listPrice: number
  soldPrice?: number | null
  listedDate: Date
  beds: number
  baths: number
  sqft: number | null
  neighborhood: string
  description: string | null
  address: ListingAddress
  slug: string
  latitude: number
  longitude: number
  rental?: boolean
  photoGallery?: PhotoGalleryImage[]
  openHouses: OpenHouse[]
  placeId?: string
}

export interface ListingDetail extends Listing {
  propertyType: PropertyType
  yearBuilt: number
  soldDate?: string
  daysOnMarket: number
  propertyDetails?: PropertDetailsSection[]
  lotSize: number
}

export interface BoundaryRecord {
  _id: string
  name: string
  type: string
  geometry: {
    type: string
    coordinates: MultiPolygon
  }
  placeId: string
}

export interface ListingSearchPagination {
  page: number
  pageSize: number
  numberReturned: number
  numberAvailable: number
  numberOfPages: number
}

export interface ListingSearchResponse {
  listings: Listing[]
  pagination: ListingSearchPagination
}

export interface BoundarySearchResponse extends ListingSearchResponse {
  boundary: BoundaryRecord
}

export interface ListingSearchGeocodeResponse
  extends Partial<ListingSearchResponse> {
  boundary?: BoundaryRecord
  viewport?: ViewportLatLngBounds
  listingDetail?: ListingDetail
}
