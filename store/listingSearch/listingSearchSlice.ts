import { type PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { HighlightedMarker, ListingSearchState } from "./listingSearchTypes";

const initialState: ListingSearchState = {
  highlightedMarker: null
};

export const listingSearchSlice = createSlice({
  name: "listingSearch",

  initialState,

  reducers: {
    setHighlightedMarker: (state, action: PayloadAction<HighlightedMarker>) => {
      state.highlightedMarker = action.payload;
    }
  }
});

export const { setHighlightedMarker } = listingSearchSlice.actions;

export default listingSearchSlice.reducer;
