import type { Types } from 'mongoose'
import type { IListing } from '../models/ListingModel'
import type { IBoundary } from '../models/BoundaryModel'
import {
  ListingResultProjectionFields,
  ListingDetailResultProjectionFields
} from '../config'
import { LatLngBounds } from '@googlemaps/google-maps-services-js'

export type AdditionalListingResultFields = {
  _id: Types.ObjectId
  latitude: number
  longitude: number
}

export type ListingResultWithSelectedFields = Pick<
  IListing,
  Exclude<keyof typeof ListingResultProjectionFields, 'latitude' | 'longitude'>
> &
  AdditionalListingResultFields

export type ListingRadiusResultWithSelectedFields =
  ListingResultWithSelectedFields & { distance: number }

export type ListingDetailResultWithSelectedFields = Pick<
  IListing,
  Exclude<
    keyof typeof ListingDetailResultProjectionFields,
    'latitude' | 'longitude'
  >
> &
  AdditionalListingResultFields

export type PaginationResponse = {
  page: number
  pageSize: number
  numberReturned: number
  numberAvailable: number
  numberOfPages: number
}

export type ListingSearchResponse<T = ListingResultWithSelectedFields> = {
  listings: T[]
  pagination: PaginationResponse
}

export type BoundarySearchResponse = ListingSearchResponse & {
  boundary: IBoundary
}

export type GeocodeBoundarySearchResponse = Partial<ListingSearchResponse> & {
  boundary?: IBoundary
  viewport?: LatLngBounds
  listingDetail?: ListingDetailResultWithSelectedFields
}

export type ServiceError = {
  message: string
  field?: string
}

export type ErrorResponse = {
  errors: ServiceError[]
}
