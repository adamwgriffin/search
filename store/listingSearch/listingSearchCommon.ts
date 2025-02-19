import type {
  ListingSearchGeocodeResponse,
  ListingSearchResponse,
  BoundarySearchResponse
} from '../../types/listing_types'
import { createAction } from '@reduxjs/toolkit'
import axiosInstance from '../../lib/http'
import { createAppAsyncThunk } from '../../lib/store_helpers'
import {
  selectParamsForGeocodeSearch,
  selectParamsForGeospatialSearch
} from './listingSearchSelectors'

type CurrentLocationResponse = ListingSearchResponse | BoundarySearchResponse

/**
 * Initiates a new request to the Listing Service to geocode what is entered in the search field
 */
export const newLocationGeocodeSearch =
  createAppAsyncThunk<ListingSearchGeocodeResponse>(
    'listingSearch/newLocationGeocodeSearch',
    async (_arg, { getState }) => {
      const response = await axiosInstance.get<ListingSearchGeocodeResponse>(
        '/api/listing/search/geocode',
        {
          params: selectParamsForGeocodeSearch(getState())
        }
      )
      return response.data
    }
  )

/**
 * Executes a Listing Service request for the current location. We want to use this request when the place that was
 * entered in the search field has already been geocoded. Usually we would perform the initial search using the
 * searchNewLocation() function, which has the service geocode the location, then we would use this for subsequent
 * requests, such as if the user dragged the map or changed the filters. Since we have the boundary data stored from the
 * previous request, we can just pass the boundary ID to the service instead of having the service geocode the place for
 * us again. If the boundary is not active, then all we need is the viewport bounds, which will always be included in
 * the params we use for this request.
 */
export const searchCurrentLocation =
  createAppAsyncThunk<CurrentLocationResponse>(
    'listingSearch/searchCurrentLocation',
    async (_arg, { getState }) => {
      const state = getState()
      const url = state.listingMap.boundaryActive
        ? `/api/listing/search/boundary/${state.listingSearch.boundaryId}`
        : 'api/listing/search/bounds'
      const response = await axiosInstance.get<CurrentLocationResponse>(url, {
        params: selectParamsForGeospatialSearch(state)
      })
      return response.data
    }
  )

/**
 * The same as searchCurrentLocation but it will trigger a reset of the page index when it's state is pending
 */
export const searchWithUpdatedFilters = createAppAsyncThunk(
  'listingSearch/searchWithUpdatedFilters',
  async (_args, { dispatch }) => {
    dispatch(searchCurrentLocation())
  }
)

export const standaloneSearchInitialized = createAction(
  'listingSearch/standaloneSearchInitialized'
)
