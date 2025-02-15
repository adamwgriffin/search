import type { NextPage } from 'next'
import type { SortFilters } from '../../store/filters/filtersTypes'
import styles from './SearchResults.module.css'
import ListingResultsHeader from '../../components/listings/ListingResultsHeader/ListingResultsHeader'
import ListingResultsPagination from '../../components/listings/ListingResultsPagination/ListingResultsPagination'
import { useAppSelector, useAppDispatch } from '../../hooks/app_hooks'
import { useOpenListingDetail } from '../../hooks/open_listing_detail_hook'
import { setHighlightedMarker } from '../../store/listingSearch/listingSearchSlice'
import {
  searchCurrentLocation,
  searchWithUpdatedFilters
} from '../../store/listingSearch/listingSearchCommon'
import {
  selectListings,
  selectPagination,
  selectInitialSearchComplete,
  selectListingSearchRunning
} from '../../store/listingSearch/listingSearchSelectors'
import { setFilters, clearFilters } from '../../store/filters/filtersSlice'
import {
  selectSortBy,
  selectSearchType
} from '../../store/filters/filtersSelectors'
import ListingCards from '../../components/listings/ListingCards/ListingCards'
import NoResults from '../../components/listings/NoResults/NoResults'
import { useEffect, useRef } from 'react'
import { selectMobileViewType } from '../../store/application/applicationSlice'

const SearchResults: NextPage = () => {
  const dispatch = useAppDispatch()
  const sortBy = useAppSelector(selectSortBy)
  const searchType = useAppSelector(selectSearchType)
  const listings = useAppSelector(selectListings)
  const pagination = useAppSelector(selectPagination)
  const initialSearchComplete = useAppSelector(selectInitialSearchComplete)
  const listingSearchRunning = useAppSelector(selectListingSearchRunning)
  const openListingDetail = useOpenListingDetail(false)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const mobileViewType = useAppSelector(selectMobileViewType)

  useEffect(() => {
    if (listingSearchRunning && searchResultsRef?.current?.scrollTop) {
      searchResultsRef.current.scrollTop = 0
    }
  }, [listingSearchRunning])

  const handleSortMenuChange = (sortParams: SortFilters) => {
    dispatch(setFilters(sortParams))
    dispatch(searchWithUpdatedFilters())
  }

  const handlePaginationButtonClick = (pageIndex: number) => {
    dispatch(setFilters({ pageIndex }))
    dispatch(searchCurrentLocation())
  }

  const handleListingCardMouseEnter = (listingId: string) => {
    dispatch(setHighlightedMarker(listingId))
  }

  const handleListingCardMouseLeave = () => {
    dispatch(setHighlightedMarker(null))
  }

  const handleClearAll = () => {
    dispatch(clearFilters())
    dispatch(searchWithUpdatedFilters())
  }

  const resultsClassName =
    mobileViewType === 'list'
      ? styles.searchResultsMobileListView
      : styles.searchResults

  return (
    <div ref={searchResultsRef} className={resultsClassName}>
      <ListingResultsHeader
        totalListings={pagination.total}
        listingSearchRunning={listingSearchRunning}
        sortBy={sortBy}
        searchType={searchType}
        onSortMenuChange={handleSortMenuChange}
      />
      {(listings.length > 0 || listingSearchRunning) && (
        <ListingCards
          listings={listings}
          listingSearchRunning={listingSearchRunning}
          onListingCardClick={openListingDetail}
          onListingCardMouseEnter={handleListingCardMouseEnter}
          onListingCardMouseLeave={handleListingCardMouseLeave}
        />
      )}
      {listings.length === 0 &&
        initialSearchComplete &&
        !listingSearchRunning && (
          <NoResults onClearFiltersClick={handleClearAll} />
        )}
      {listings.length > 0 && (
        <ListingResultsPagination
          {...pagination}
          onClick={handlePaginationButtonClick}
        />
      )}
    </div>
  )
}

export default SearchResults
