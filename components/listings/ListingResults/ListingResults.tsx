"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchState } from "@/hooks/useSearchState";
import ListingCards from "@/components/listings/ListingCards/ListingCards";
import NoResults from "@/components/listings/NoResults/NoResults";
import { useOpenListingDetail } from "@/hooks/open_listing_detail_hook";
import { setHighlightedMarker } from "@/store/applicationStore";
import { searchQueryOptions } from "@/lib/queries";
import ListingCardsLoading from "@/components/listings/ListingCardsLoading/ListingCardsLoading";

const ListingResults: React.FC = () => {
  const openListingDetail = useOpenListingDetail(false);
  const { searchState } = useSearchState();
  // We're using useSuspenseQuery instead of useQuery here in order to avoid
  // hydration errors that occur when this component is wrapped inside
  // <Suspense>
  const { data: results, isFetching } = useQuery(
    searchQueryOptions(searchState)
  );

  const handleListingCardMouseEnter = (listingId: string) => {
    setHighlightedMarker(listingId);
  };

  const handleListingCardMouseLeave = () => {
    setHighlightedMarker(null);
  };

  if (isFetching) {
    return <ListingCardsLoading />;
  }

  // Only display no results if we're not fetching (above) and the listing
  // number is 0. Using the conditional operator will return undefined if we
  // don't have results or listings.
  if (results?.listings?.length === 0) {
    return <NoResults />;
  }

  return (
    <ListingCards
      listings={results?.listings ?? []}
      onListingCardClick={openListingDetail}
      onListingCardMouseEnter={handleListingCardMouseEnter}
      onListingCardMouseLeave={handleListingCardMouseLeave}
    />
  );
};

export default ListingResults;
