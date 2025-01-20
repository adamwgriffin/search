'use client'

import { useCallback, useEffect } from 'react'
import { useAppSelector } from '../../hooks/app_hooks'
import { selectLocationSearchField } from '../../store/filters/filtersSelectors'
import { useSearchWithFilterState } from '../../hooks/search_with_filter_state_hook'
import SearchFieldContainer from '../SearchFieldContainer/SearchFieldContainer'
import { standaloneSearchInitialized } from '../../store/listingSearch/listingSearchCommon'
import { useAppDispatch } from '../../hooks/app_hooks'
import { useSearchNewLocation } from '../../hooks/search_new_location_hook'

const StandaloneSearchField: React.FC = () => {
  const locationSearchField = useAppSelector(selectLocationSearchField)
  const searchNewLocation = useSearchNewLocation()
  const searchWithFilterState = useSearchWithFilterState()
  const dispatch = useAppDispatch()

  // Reset the filters back to defaults in case a previous search on the /homes page changed them
  useEffect(() => {
    dispatch(standaloneSearchInitialized())
  }, [dispatch])

  const searchThenRedirect = useCallback(
    async (locationSearchField: string) => {
      const res = await searchNewLocation(locationSearchField)
      // The searchNewLocation hook would have already redirected if listingDetail was found
      if (!res.listingDetail) {
        searchWithFilterState({ locationSearchField })
      }
    },
    [searchNewLocation, searchWithFilterState]
  )

  // For onOptionSelected, the locationSearchField doesn't get updated with in the filter state by the time we redirect
  // to the search page, so we only get the partial text that was typed in the field, instead of the entire text that
  // was selected in the autocomplete. We're adding the autocompletePrediction.description here in order to fix that.
  return (
    <SearchFieldContainer
      onSearchInitiated={() => searchThenRedirect(locationSearchField)}
      onOptionSelected={(autocompletePrediction) =>
        searchThenRedirect(autocompletePrediction.description)
      }
    />
  )
}

export default StandaloneSearchField
