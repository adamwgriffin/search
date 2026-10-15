import type { SearchState } from "@/zod_schemas/searchStateSchema";
import type { SavedSearch } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "..";
import axiosInstance from "../../lib/http";
import { createAppAsyncThunk } from "../../lib/store_helpers";
import type { Listing } from "../../types/listing_types";
import { type CurrentUser } from "@/app/api/current_user/route";

export type SavedSearchData = Omit<
  SavedSearch,
  "createdAt" | "updatedAt" | "searchState"
> & {
  createdAt: string;
  updatedAt: string;
  searchState: SearchState;
};

export type CreateSavedSearchData = Omit<
  SavedSearchData,
  "id" | "createdAt" | "updatedAt"
>;

export type GetListingsByIdsResponse = {
  listings: Listing[];
};

export type UserState = {
  favoriteListings: Listing[];
  getFavoriteListingsLoading: boolean;
};

const initialState: UserState = {
  favoriteListings: [],
  getFavoriteListingsLoading: false
};

export const getFavoriteListings = createAppAsyncThunk<
  GetListingsByIdsResponse,
  CurrentUser["favoriteIds"]
>("user/getFavoriteListings", async (favoriteIds) => {
  const res = await axiosInstance.get<GetListingsByIdsResponse>(
    `/api/listings/${favoriteIds}`
  );
  return res.data;
});

export const createSavedSearch = createAppAsyncThunk<
  SavedSearchData,
  CreateSavedSearchData
>("user/createSavedSearch", async (newSavedSearchData) => {
  const res = await axiosInstance.post<SavedSearchData>(
    "/api/saved_search",
    newSavedSearchData
  );
  return res.data;
});

export const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getFavoriteListings.pending, (state) => {
      state.getFavoriteListingsLoading = true;
    });

    builder.addCase(getFavoriteListings.fulfilled, (state, action) => {
      state.getFavoriteListingsLoading = false;
      state.favoriteListings = action.payload.listings;
    });

    builder.addCase(getFavoriteListings.rejected, (state) => {
      state.getFavoriteListingsLoading = false;
    });
  }
});

export const selectFavoriteListings = (state: AppState) =>
  state.user.favoriteListings;

export const selectGetFavoriteListingsLoading = (state: AppState) =>
  state.user.getFavoriteListingsLoading;

export default userSlice.reducer;
