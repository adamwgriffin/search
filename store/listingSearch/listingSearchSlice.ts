import { type PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  SelectedListing,
  HighlightedMarker,
  ListingSearchState
} from "./listingSearchTypes";

const initialState: ListingSearchState = {
  selectedListing: null,
  highlightedMarker: null
};

export const listingSearchSlice = createSlice({
  name: "listingSearch",

  initialState,

  reducers: {
    setSelectedListing: (state, action: PayloadAction<SelectedListing>) => {
      state.selectedListing = action.payload;
    },

    setHighlightedMarker: (state, action: PayloadAction<HighlightedMarker>) => {
      state.highlightedMarker = action.payload;
    }
  }
});

export const { setSelectedListing, setHighlightedMarker } =
  listingSearchSlice.actions;

export default listingSearchSlice.reducer;
