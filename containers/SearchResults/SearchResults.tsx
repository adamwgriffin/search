"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import ListingResultsPagination, {
  type Pagination
} from "@/components/listings/ListingResultsPagination/ListingResultsPagination";
import { useSearchState } from "@/hooks/useSearchState";
import { ListingSearchPagination } from "@/types";
import range from "lodash/range";
import { useEffect, useRef } from "react";
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
  // We're using useSuspenseQuery instead of useQuery here in order to avoid
  // hydration errors that occur when this component is wrapped inside
  // <Suspense>
  const { data: results, isPending: isFetching } = useSuspenseQuery(
    searchQueryOptions(searchState)
  );

  if (searchResultsRef?.current?.scrollTop) {
    searchResultsRef.current.scrollTop = 0;
  }

  const listings = results?.listings ?? [];

  return (
    <SearchResultsBody ref={searchResultsRef} mobileViewType={mobileViewType}>
      <ListingResultsHeader
        totalListings={results?.pagination?.numberAvailable ?? 0}
        loading={isFetching}
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
