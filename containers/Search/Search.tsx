'use client'

import type { NextPage } from 'next'
import { useAppSelector } from '../../hooks/app_hooks'
import { selectViewType } from '../../store/application/applicationSlice'
import styles from './Search.module.css'
import SearchHeader from '../SearchHeader/SearchHeader'
import SearchResults from '../../containers/SearchResults/SearchResults'
import ListingMap from '../ListingMap/ListingMap'
import SearchModals from '../../components/SearchModals'

const Search: NextPage = () => {
  const viewType = useAppSelector(selectViewType)
  const resultsClassName =
    viewType === 'list' ? styles.resultsListView : styles.resultsMapView

  return (
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
  )
}

export default Search
