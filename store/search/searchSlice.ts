import { type SearchState } from "@/zod_schemas/searchStateSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SearchState = {};

export const searchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    setSearch(_state, action: PayloadAction<SearchState>) {
      return action.payload;
    }
  }
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
