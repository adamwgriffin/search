'use client'

import { useGetCurrentUserIfAuthenticated } from '../../hooks/get_current_user_if_authenticated_hook'
import { useSyncSearchStateWithUrl } from '../../hooks/sync_search_state_with_url_hook'
import Search from '../../containers/Search/Search'
import GoogleMapsProvider from '../../providers/GoogleMapsProvider'

const SearchPage = () => {
  // We want to get the currentUser so that we can display their favorites on
  // the listing cards
  useGetCurrentUserIfAuthenticated()
  useSyncSearchStateWithUrl()

  return (
    <GoogleMapsProvider>
      <Search />
    </GoogleMapsProvider>
  )
}

export default SearchPage
