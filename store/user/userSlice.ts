import type { SearchState } from "@/zod_schemas/searchStateSchema";
import type { SavedSearch, User } from "@prisma/client";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "..";
import axiosInstance from "../../lib/http";
import { createAppAsyncThunk } from "../../lib/store_helpers";
import type { DefaultAPIResponse } from "../../types";
import type { Listing } from "../../types/listing_types";

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

export type CurrentUser = Pick<
  User,
  "id" | "name" | "email" | "image" | "favoriteIds"
>;

export type GetListingsByIdsResponse = {
  listings: Listing[];
};

export type UserState = {
  currentUser: CurrentUser | null;
  previousFavoriteIds: string[];
  favoriteListings: Listing[];
  getFavoriteListingsLoading: boolean;
};

const initialState: UserState = {
  currentUser: null,
  previousFavoriteIds: [],
  favoriteListings: [],
  getFavoriteListingsLoading: false
};

export const getCurrentUser = createAppAsyncThunk<
  UserState["currentUser"] | null
>("user/getCurrentUser", async () => {
  const res =
    await axiosInstance.get<UserState["currentUser"]>("/api/current_user");
  return res.data;
});

/**
 * Optimistically updates currentUser.favoriteIds with the given listingId. Adds
 * the ID if it doesn't exist, otherwise removes it.
 */
export const toggleFavorite = createAppAsyncThunk<
  DefaultAPIResponse,
  Listing["_id"]
>("user/toggleFavorite", async (listingId, { dispatch, getState }) => {
  const state = getState();
  if (!state.user.currentUser) return;
  dispatch(setPreviousFavoriteIds(state.user.currentUser.favoriteIds));
  if (state.user.currentUser.favoriteIds.includes(listingId)) {
    dispatch(removeFromFavoriteIds(listingId));
    return (await axiosInstance.delete(`/api/favorites/${listingId}`)).data;
  } else {
    dispatch(addToFavoriteIds(listingId));
    return (await axiosInstance.post(`/api/favorites/${listingId}`)).data;
  }
});

export const getFavoriteListings =
  createAppAsyncThunk<GetListingsByIdsResponse>(
    "user/getFavoriteListings",
    async (_arg, { getState, rejectWithValue }) => {
      const state = getState();
      if (!state.user?.currentUser?.favoriteIds.length) {
        return rejectWithValue(
          "Can't get favorites because there are no favoriteIds"
        );
      }
      const res = await axiosInstance.get<GetListingsByIdsResponse>(
        `/api/listings/${state.user.currentUser.favoriteIds}`
      );
      return res.data;
    }
  );

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

  reducers: {
    resetCurrentUser(state) {
      state.currentUser = initialState.currentUser;
    },

    setPreviousFavoriteIds(state, action: PayloadAction<Listing["_id"][]>) {
      state.previousFavoriteIds = action.payload;
    },

    addToFavoriteIds(state, action: PayloadAction<Listing["_id"]>) {
      if (!state.currentUser) return;
      state.currentUser.favoriteIds.push(action.payload);
    },

    removeFromFavoriteIds(state, action: PayloadAction<Listing["_id"]>) {
      if (!state.currentUser) return;
      state.currentUser.favoriteIds = state.currentUser.favoriteIds.filter(
        (id) => id !== action.payload
      );
      // We also have to update favoriteListings in case they were loaded
      // earlier for the saved homes page
      state.favoriteListings = state.favoriteListings.filter(
        (listing) => listing._id !== action.payload
      );
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

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

    // if the request to add the favorite fails for some reason, undo the
    // optimistic update that added it to currentUser.favoriteIds.
    builder.addCase(toggleFavorite.rejected, (state, action) => {
      console.error(action.error);
      if (!state.currentUser) return;
      state.currentUser.favoriteIds = state.previousFavoriteIds;
    });
  }
});

export const {
  resetCurrentUser,
  setPreviousFavoriteIds,
  addToFavoriteIds,
  removeFromFavoriteIds
} = userSlice.actions;

export const selectCurrentUser = (state: AppState) => state.user.currentUser;

export const selectFavoriteListings = (state: AppState) =>
  state.user.favoriteListings;

export const selectGetFavoriteListingsLoading = (state: AppState) =>
  state.user.getFavoriteListingsLoading;

export default userSlice.reducer;
