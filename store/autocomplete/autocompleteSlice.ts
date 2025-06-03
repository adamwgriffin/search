import type { AppState } from "..";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../lib/store_helpers";
import { GoogleMapsAutocompleteOptions } from "../../config/googleMapsOptions";
import { standaloneSearchInitialized } from "../listingSearch/listingSearchCommon";

export interface AutocompleteState {
  autcompletePlacePredictions: google.maps.places.AutocompletePrediction[];
  selectedAutcompletePlacePrediction: google.maps.places.AutocompletePrediction | null;
}

let autocompleteService: google.maps.places.AutocompleteService;

const initialState: AutocompleteState = {
  autcompletePlacePredictions: [],
  selectedAutcompletePlacePrediction: null
};

export const getPlaceAutocompletePredictions = createAppAsyncThunk<
  google.maps.places.AutocompletePrediction[],
  string
>("places/getPlaceAutocompletePredictions", async (searchString: string) => {
  autocompleteService ||= new google.maps.places.AutocompleteService();
  const res = await autocompleteService.getPlacePredictions({
    input: searchString,
    ...GoogleMapsAutocompleteOptions
  });
  return res.predictions;
});

export const autocompleteSlice = createSlice({
  name: "autocomplete",

  initialState,

  reducers: {
    resetAutcompletePlacePredictions: (state) => {
      state.autcompletePlacePredictions =
        initialState.autcompletePlacePredictions;
    },

    autocompletePredictionSelected: (
      state,
      action: PayloadAction<google.maps.places.AutocompletePrediction>
    ) => {
      state.selectedAutcompletePlacePrediction = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(
      getPlaceAutocompletePredictions.fulfilled,
      (state, action) => {
        state.autcompletePlacePredictions = action.payload;
      }
    );

    builder.addCase(standaloneSearchInitialized, () => initialState);
  }
});

export const {
  resetAutcompletePlacePredictions,
  autocompletePredictionSelected
} = autocompleteSlice.actions;

export default autocompleteSlice.reducer;
