"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import ListingResultsPagination, {
  type Pagination
} from "@/components/listings/ListingResultsPagination/ListingResultsPagination";
import { useSearchState } from "@/hooks/useSearchState";
import { ListingSearchPagination } from "@/types";
import range from "lodash/range";
import { useDeferredValue, useEffect, useRef } from "react";
import ListingResultsHeader from "@/components/listings/ListingResultsHeader/ListingResultsHeader";
import { useAppSelector } from "@/hooks/app_hooks";
import { selectMobileViewType } from "@/store/application/applicationSlice";
import { searchQueryOptions } from "@/lib/queries";
import SearchResultsBody from "@/components/SearchResultsBody/SearchResultsBody";
import ListingResults from "@/components/listings/ListingResults/ListingResults";

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
  const mobileViewType = useAppSelector(selectMobileViewType);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { searchState, searchType, setSearchState } = useSearchState();
  // Querying with a deferred copy of searchState means that when it changes,
  // React keeps rendering the current results while the new query suspends in
  // the background, instead of replacing everything with the <Suspense>
  // fallback. The two values only differ while the new results are loading.
  const deferredSearchState = useDeferredValue(searchState);
  const loading = searchState !== deferredSearchState;
  // We're using useSuspenseQuery instead of useQuery here in order to avoid
  // hydration errors that occur when this component is wrapped inside
  // <Suspense>
  const { data: results } = useSuspenseQuery(
    searchQueryOptions(deferredSearchState)
  );

  // Scroll back to the top whenever a new set of results is displayed (e.g.,
  // after changing pages or filters)
  useEffect(() => {
    if (searchResultsRef.current) {
      searchResultsRef.current.scrollTop = 0;
    }
  }, [results]);

  const listings = results?.listings ?? [];

  return (
    <SearchResultsBody ref={searchResultsRef} mobileViewType={mobileViewType}>
      <ListingResultsHeader
        totalListings={results?.pagination?.numberAvailable ?? 0}
        loading={loading}
        searchType={searchType}
      />
      <ListingResults />
      {listings.length > 0 && results?.pagination && (
        <ListingResultsPagination
          {...getPagination(results.pagination)}
          onClick={(page_index) => setSearchState({ page_index })}
        />
      )}
    </SearchResultsBody>
  );
};

export default SearchResults;
