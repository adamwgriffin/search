"use client";

import SearchResultsBody from "@/components/SearchResultsBody/SearchResultsBody";
import MenuButtonFallback from "@/components/form/MenuButtonFallback";
import ListingResultsHeaderBody from "@/components/ListingResultsHeaderBody/ListingResultsHeaderBody";
import ListingCardsLoading from "@/components/listings/ListingCardsLoading/ListingCardsLoading";
import {
  selectMobileViewType,
  useApplicationStore
} from "@/store/applicationStore";

export default function SearchResultsFallback() {
  const mobileViewType = useApplicationStore(selectMobileViewType);

  return (
    <SearchResultsBody mobileViewType={mobileViewType}>
      <ListingResultsHeaderBody>
        <div></div>
        <MenuButtonFallback label="Sort: *******" condensed />
      </ListingResultsHeaderBody>
      <ListingCardsLoading />
    </SearchResultsBody>
  );
}
