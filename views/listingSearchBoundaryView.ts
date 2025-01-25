import type { ListingSearchAggregateResult } from '../models/ListingModel'
import type { IBoundary } from '../models/BoundaryModel'
import type { PaginationParams } from '../zod_schemas/listingSearchParamsSchema'
import type { BoundarySearchResponse } from '../types/listing_search_response_types'
import type { ListingResultWithSelectedFields } from '../types/listing_search_response_types'
import listingSearchView from './listingSearchView'

const listingSearchBoundaryView = (
  boundary: IBoundary,
  results: ListingSearchAggregateResult<ListingResultWithSelectedFields>,
  pagination: PaginationParams
): BoundarySearchResponse => {
  return {
    boundary,
    ...listingSearchView(results, pagination)
  }
}

export default listingSearchBoundaryView
