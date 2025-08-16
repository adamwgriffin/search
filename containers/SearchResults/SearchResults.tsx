"use client";

import ListingResultsPagination, {
  type Pagination
} from "@/components/listings/ListingResultsPagination/ListingResultsPagination";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSearchState } from "@/providers/SearchStateProvider";
import { ListingSearchPagination } from "@/types";
import range from "lodash/range";
import { useEffect, useRef } from "react";
import ListingCards from "../../components/listings/ListingCards/ListingCards";
import ListingResultsHeader from "../../components/listings/ListingResultsHeader/ListingResultsHeader";
import NoResults from "../../components/listings/NoResults/NoResults";
import { useAppDispatch, useAppSelector } from "../../hooks/app_hooks";
import { useOpenListingDetail } from "../../hooks/open_listing_detail_hook";
import { selectMobileViewType } from "../../store/application/applicationSlice";
import { setHighlightedMarker } from "../../store/listingSearch/listingSearchSlice";
import styles from "./SearchResults.module.css";
import { hasProperties } from "@/lib";

const getPagination = (p: ListingSearchPagination): Pagination => {
  return {
    start: p.page * p.pageSize + 1,
    end: p.page * p.pageSize + p.numberReturned,
    total: p.numberAvailable,
    pages: range(0, p.numberOfPages),
    currentPage: p.page
  };
};

const SearchResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const openListingDetail = useOpenListingDetail(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const mobileViewType = useAppSelector(selectMobileViewType);
  const { data: results, isFetching } = useSearchResults();
  const { searchState, searchType, setSearchState } = useSearchState();

  useEffect(() => {
    if (isFetching && searchResultsRef?.current?.scrollTop) {
      searchResultsRef.current.scrollTop = 0;
    }
  }, [isFetching]);

  const handleListingCardMouseEnter = (listingId: string) => {
    dispatch(setHighlightedMarker(listingId));
  };

  const handleListingCardMouseLeave = () => {
    dispatch(setHighlightedMarker(null));
  };

  const listings = results?.listings ?? [];

  const resultsClassName =
    mobileViewType === "list"
      ? styles.searchResultsMobileListView
      : styles.searchResults;

  const searchParamsPresent = hasProperties(searchState);

  return (
    <div ref={searchResultsRef} className={resultsClassName}>
      <ListingResultsHeader
        totalListings={results?.pagination?.numberAvailable ?? 0}
        loading={searchParamsPresent && isFetching}
        searchType={searchType}
      />
      {(listings.length > 0 || isFetching) && (
        <ListingCards
          listings={listings}
          listingSearchRunning={searchParamsPresent && isFetching}
          onListingCardClick={openListingDetail}
          onListingCardMouseEnter={handleListingCardMouseEnter}
          onListingCardMouseLeave={handleListingCardMouseLeave}
        />
      )}
      {searchParamsPresent && listings.length === 0 && <NoResults />}
      {listings.length > 0 && results?.pagination && (
        <ListingResultsPagination
          {...getPagination(results.pagination)}
          onClick={(page_index) => setSearchState({ page_index })}
        />
      )}
    </div>
  );
};

export default SearchResults;
