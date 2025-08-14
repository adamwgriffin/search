import type { AppState } from "..";
import type { HighlightedMarker } from "./listingSearchTypes";

export const selectHighlightedMarker = (state: AppState): HighlightedMarker =>
  state.listingSearch.highlightedMarker;
