'use client'

import type { NextPage } from 'next'
import styles from './SearchResults.module.css'
import ListingResultsHeader from '../../components/listings/ListingResultsHeader/ListingResultsHeader'
import { useAppSelector, useAppDispatch } from '../../hooks/app_hooks'
import { useOpenListingDetail } from '../../hooks/open_listing_detail_hook'
import { setHighlightedMarker } from '../../store/listingSearch/listingSearchSlice'
import { selectSearchType } from '../../store/filters/filtersSelectors'
import ListingCards from '../../components/listings/ListingCards/ListingCards'
import NoResults from '../../components/listings/NoResults/NoResults'
import { useEffect, useRef } from 'react'
import { selectMobileViewType } from '../../store/application/applicationSlice'
import { useSearchResults } from '~/hooks/useSearchResults'

const SearchResults: NextPage = () => {
  const dispatch = useAppDispatch()
  const searchType = useAppSelector(selectSearchType)
  const openListingDetail = useOpenListingDetail(false)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const mobileViewType = useAppSelector(selectMobileViewType)
  const { data: results, isFetching, isError } = useSearchResults()

  useEffect(() => {
    if (isFetching && searchResultsRef?.current?.scrollTop) {
      searchResultsRef.current.scrollTop = 0
    }
  }, [isFetching])

  const handleListingCardMouseEnter = (listingId: string) => {
    dispatch(setHighlightedMarker(listingId))
  }

  const handleListingCardMouseLeave = () => {
    dispatch(setHighlightedMarker(null))
  }

  const listings = results?.listings ?? []

  const resultsClassName =
    mobileViewType === 'list'
      ? styles.searchResultsMobileListView
      : styles.searchResults

  return (
    <div ref={searchResultsRef} className={resultsClassName}>
      <ListingResultsHeader
        totalListings={results?.pagination?.numberAvailable ?? 0}
        loading={isFetching}
        searchType={searchType}
      />
      {(listings.length > 0 || isFetching) && (
        <ListingCards
          listings={listings}
          listingSearchRunning={isFetching}
          onListingCardClick={openListingDetail}
          onListingCardMouseEnter={handleListingCardMouseEnter}
          onListingCardMouseLeave={handleListingCardMouseLeave}
        />
      )}
      {listings.length === 0 && !isFetching && (
        <NoResults />
      )}
      {/* {listings.length > 0 && (
        <ListingResultsPagination
          {...pagination}
          onClick={handlePaginationButtonClick}
        />
      )} */}
    </div>
  )
}

export default SearchResults
