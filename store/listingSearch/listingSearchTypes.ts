export type SelectedListing = string | null;

export type HighlightedMarker = string | null;

export interface ListingSearchState {
  selectedListing: SelectedListing;
  highlightedMarker: HighlightedMarker;
}
