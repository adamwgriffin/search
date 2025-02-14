'use client'

import type { NextPage } from 'next'
import { useAppSelector } from '../../hooks/app_hooks'
import { selectViewType } from '../../store/application/applicationSlice'
import { useGetCurrentUserIfAuthenticated } from '../../hooks/get_current_user_if_authenticated_hook'
import { useSyncSearchStateWithUrl } from '../../hooks/sync_search_state_with_url_hook'
import GoogleMapsProvider from '../../providers/GoogleMapsProvider'
import SearchHeader from '../../containers/SearchHeader/SearchHeader'
import SearchResults from '../../containers/SearchResults/SearchResults'
import ListingMap from '../../containers/ListingMap/ListingMap'
import SearchModals from '../../components/SearchModals'
import styles from './page.module.css'

const SearchPage: NextPage = () => {
  const viewType = useAppSelector(selectViewType)
  const resultsClassName =
    viewType === 'list' ? styles.resultsListView : styles.resultsMapView
  // We want to get the currentUser so that we can display their favorites on
  // the listing cards
  useGetCurrentUserIfAuthenticated()
  useSyncSearchStateWithUrl()

  return (
    <GoogleMapsProvider>
      <div className={styles.search}>
        <div>
          <SearchHeader />
        </div>
        <div className={resultsClassName}>
          <div className={styles.searchResults}>
            <SearchResults />
          </div>
          <div className={styles.listingMap}>
            <ListingMap />
          </div>
        </div>
        <SearchModals />
      </div>
    </GoogleMapsProvider>
  )
}

export default SearchPage
