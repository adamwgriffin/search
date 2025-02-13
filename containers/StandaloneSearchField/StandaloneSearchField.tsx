'use client'

import { useCallback, useEffect } from 'react'
import { useAppSelector } from '../../hooks/app_hooks'
import { selectLocationSearchField } from '../../store/filters/filtersSelectors'
import { useRedirectToSearch } from '../../hooks/redirect_to_search_hook'
import SearchFieldContainer from '../SearchFieldContainer/SearchFieldContainer'
import { standaloneSearchInitialized } from '../../store/listingSearch/listingSearchCommon'
import { useAppDispatch } from '../../hooks/app_hooks'
import { useSearchNewLocation } from '../../hooks/search_new_location_hook'

const StandaloneSearchField: React.FC = () => {
  const locationSearchField = useAppSelector(selectLocationSearchField)
  const searchNewLocation = useSearchNewLocation()
  const redirectToSearch = useRedirectToSearch()
  const dispatch = useAppDispatch()

  // Reset the filters back to defaults in case a previous search on the /homes page changed them
  useEffect(() => {
    dispatch(standaloneSearchInitialized())
  }, [dispatch])

  const searchThenRedirect = useCallback(
    async (locationSearchField: string) => {
      if (!locationSearchField) return
      const res = await searchNewLocation()
      // The searchNewLocation hook would have already redirected if
      // listingDetail was found, otherwise we need to redirect to the search
      // page here
      if (!res.listingDetail) {
        redirectToSearch({ locationSearchField })
      }
    },
    [searchNewLocation, redirectToSearch]
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
