import { AddressGeometry } from '@googlemaps/google-maps-services-js'
import type {
  GeocodeBoundarySearchResponse,
  ListingDetailResultWithSelectedFields
} from '../types/listing_search_response_types'

const listingSearchGeocodeNoBoundaryView = (
  viewport: AddressGeometry['viewport'],
  listingDetail: ListingDetailResultWithSelectedFields | null | undefined = null
): GeocodeBoundarySearchResponse => {
  listingDetail?.soldDate
  return listingDetail ? { listingDetail } : { viewport }
}

export default listingSearchGeocodeNoBoundaryView
