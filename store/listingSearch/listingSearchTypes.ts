import { Listing, ListingSearchPagination } from "../../types/listing_types";

export type SelectedListing = string | null;

export type HighlightedMarker = string | null;

export interface ListingSearchState {
  boundaryId: string | null;
  listings: Listing[];
  pagination: ListingSearchPagination | null;
  initialSearchComplete: boolean;
  doListingSearchOnMapIdle: boolean;
  listingSearchRunning: boolean;
  selectedListing: SelectedListing;
  highlightedMarker: HighlightedMarker;
}
