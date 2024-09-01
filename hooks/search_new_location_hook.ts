import type { ViewportLatLngBounds } from '../store/listingMap/listingMapTypes'
import type { ListingSearchGeocodeResponse } from '../lib/types/listing_types'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import isEqual from 'lodash/isEqual'
import { useAppSelector, useAppDispatch } from './app_hooks'
import {
  newLocationGeocodeSearch,
  searchCurrentLocation
} from '../store/listingSearch/listingSearchCommon'
import {
  boundaryFoundForNewLocationSearch,
  noBoundaryFoundForNewLocationSearch
} from '../store/listingSearch/listingSearchSlice'
import { listingFoundForAddressSearch } from '../store/listingDetail/listingDetailSlice'
import { selectViewportBounds } from '../store/listingMap/listingMapSelectors'
import { unwrapResult } from '@reduxjs/toolkit'

const sameViewportBoundsAsPreviousNewLocationSearch = (
  currentViewportBounds: ViewportLatLngBounds | null,
  listingSearchResponse: ListingSearchGeocodeResponse
) => isEqual(currentViewportBounds, listingSearchResponse.viewport)

/**
 * Makes a new request to the Listing Service to geocode what is entered in the search field then dispatches the
 * appropriate action based on the data returned from the service.
 */
export const useSearchNewLocation = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const currentViewportBounds = useAppSelector(selectViewportBounds)

  // It's very important to put this function inside of useCallback. Without it, we can get into infinite loops with
  // several of the useEffect hooks that have it in their dependency array.
  return useCallback(async () => {
    const res = unwrapResult(await dispatch(newLocationGeocodeSearch()))

    // We found a boundary for the location. This is the normal response we would expect.
    if (res.boundary) {
      dispatch(boundaryFoundForNewLocationSearch(res))
      return
    }

    // There was no boundary found. Look at the response to determine what to do next

    // If listingDetail is present, we can assume that what was searched for was an address, and that the service found
    // a listing for that address
    if (res.listingDetail) {
      await dispatch(listingFoundForAddressSearch(res.listingDetail))
      router.push(`/listing/${res.listingDetail._id}`)
      return
    }

    // No boundary and no listing means either A) it was an address search and no listing was available for that
    // address, or B) there simply is no boundary available for the location that was searched. Either way, the course
    // of action is the same: use the viewport bounds from the geocoder result to adjust the map to the location and
    // then search without a boundary instead. We have to check if the bounds are the same as before in case the user
    // just clicked the search button again. This is because having the same bounds would not cause the map to trigger
    // it's "idle" event, which is what's normally used to trigger the searchCurrentLocation after the map has been
    // adjusted.
    if (!res.viewport) {
      throw new Error('Invalid response.')
    }
    if (
      sameViewportBoundsAsPreviousNewLocationSearch(currentViewportBounds, res)
    ) {
      dispatch(searchCurrentLocation())
    } else {
      dispatch(noBoundaryFoundForNewLocationSearch(res))
    }
  }, [currentViewportBounds, dispatch, router])
}
