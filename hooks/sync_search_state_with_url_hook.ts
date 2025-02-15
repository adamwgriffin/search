import type { FiltersState } from '../store/filters/filtersTypes'
import { useState, useCallback, useEffect } from 'react'
import { useEvent } from 'react-use'
import isEqual from 'lodash/isEqual'
import { useAppSelector, useAppDispatch } from './app_hooks'
import { usePushParamsToSearchUrl } from './push_params_to_search_url_hook'
import { useSearchNewLocation } from './search_new_location_hook'
import { listingSearchURLParamsToSearchState } from '../lib/url'
import { initialState, setFilters } from '../store/filters/filtersSlice'
import {
  selectInitialSearchComplete,
  selectListingSearchRunning
} from '../store/listingSearch/listingSearchSelectors'
import { selectSearchState } from '../store/filters/filtersSelectors'
import { searchCurrentLocation } from '../store/listingSearch/listingSearchCommon'
import { setDoListingSearchOnMapIdle } from '../store/listingSearch/listingSearchSlice'

export const useSyncSearchStateWithUrl = () => {
  const dispatch = useAppDispatch()
  const listingSearchRunning = useAppSelector(selectListingSearchRunning)
  const initialSearchComplete = useAppSelector(selectInitialSearchComplete)
  const pushParamsToSearchUrl = usePushParamsToSearchUrl()
  const searchNewLocation = useSearchNewLocation()
  const searchState = useAppSelector(selectSearchState)
  const [previousSearchState, setPreviousSearchState] =
    useState<Partial<FiltersState>>()

  // Get the browser url query string, convert it to a state object, use it to
  // set the state, then run a new search based on that state.
  const getSearchParamsAndSetSearchState =
    useCallback((): Partial<FiltersState> => {
      // We have to include all the intial state and then override those
      // defaults with the params from the url. This is necessary because the
      // url only includes params that are different from the default filters.
      // It is possible for the app's filters to have been changed from the
      // default but then a brand new url is entered. In that scenario the
      // internal state and the url params may get out of sync.
      const newSearchState = {
        ...initialState,
        ...listingSearchURLParamsToSearchState(
          new URLSearchParams(window.location.search)
        )
      }
      dispatch(setFilters(newSearchState))
      return newSearchState
    }, [dispatch])

  // This useEffect is the entrypoint for getting params from the url and
  // running the first search after the page loads
  useEffect(() => {
    const searchState = getSearchParamsAndSetSearchState()
    if (searchState.locationSearchField) {
      searchNewLocation()
    } else {
      dispatch(setDoListingSearchOnMapIdle(true))
    }
  }, [dispatch, getSearchParamsAndSetSearchState, searchNewLocation])

  // If the user clicks the back or forward button in the browser, we want to
  // get the url that was loaded from the previous/next part of the browser
  // history, and then run a new search to match the url params. The "popstate"
  // event is triggered whenever the history is changed by the user in this way.
  const onPopState = useCallback(() => {
    const newSearchState = getSearchParamsAndSetSearchState()
    if (
      newSearchState.locationSearchField ===
      previousSearchState?.locationSearchField
    ) {
      dispatch(searchCurrentLocation())
    } else {
      searchNewLocation()
    }
  }, [
    dispatch,
    getSearchParamsAndSetSearchState,
    previousSearchState?.locationSearchField,
    searchNewLocation
  ])

  useEvent('popstate', onPopState)

  // Each time the user triggers a new search, we want to update the url, so
  // that if the user were to go directly to this new url in the future, it
  // would load this specific search. We're checking initialSearchComplete here
  // because we don't want to change the url if we just used it to set the
  // searchState and run the initial search in the other useEffect callback
  // above. It's only on subsequent runs that we would want to update the url to
  // reflect whatever filters the user has changed. Doing this prevents us from
  // adding a duplicate url to the browser history, which can make if seem as if
  // the back button doesn't work if the user clicks it after the search page
  // first loads.
  useEffect(() => {
    const shouldUpdateURL =
      listingSearchRunning &&
      initialSearchComplete &&
      // Avoid updating unless the searchState changed, otherwise clicking the
      // back button will not change the url
      !isEqual(searchState, previousSearchState)
    if (shouldUpdateURL) {
      pushParamsToSearchUrl(searchState)
      setPreviousSearchState(searchState)
    }
  }, [
    listingSearchRunning,
    initialSearchComplete,
    searchState,
    previousSearchState,
    pushParamsToSearchUrl
  ])
}
