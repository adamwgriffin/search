'use client'

import type { NextPage } from 'next'
import { useRef, useEffect } from 'react'
import { useAppSelector } from '../../hooks/app_hooks'
import { selectViewType } from '../../store/application/applicationSlice'
import { selectListingSearchRunning } from '../../store/listingSearch/listingSearchSelectors'
import styles from './Search.module.css'
import SearchHeader from '../SearchHeader/SearchHeader'
import SearchResults from '../../containers/SearchResults/SearchResults'
import ListingMap from '../ListingMap/ListingMap'
import SearchModals from '../../components/SearchModals'

const Search: NextPage = () => {
  const viewType = useAppSelector(selectViewType)
  const listingSearchRunning = useAppSelector(selectListingSearchRunning)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const resultsClassName =
    viewType === 'list' ? styles.resultsListView : styles.resultsMapView

  useEffect(() => {
    if (listingSearchRunning && searchResultsRef?.current?.scrollTop) {
      searchResultsRef.current.scrollTop = 0
    }
  }, [listingSearchRunning])

  return (
    <div className={styles.search}>
      <div>
        <SearchHeader />
      </div>
      <div className={resultsClassName}>
        <div ref={searchResultsRef} className={styles.searchResults}>
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
