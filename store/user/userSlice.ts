import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "..";
import type { User, SavedSearch } from "@prisma/client";
import type { Listing } from "../../types/listing_types";
import type { FiltersState } from "../filters/filtersTypes";
import type { DefaultAPIResponse } from "../../types";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import omit from "lodash/omit";
import { createAppAsyncThunk } from "../../lib/store_helpers";
import axiosInstance from "../../lib/http";

export type SavedSearchData = Omit<
  SavedSearch,
  "createdAt" | "updatedAt" | "searchState"
> & {
  createdAt: string;
  updatedAt: string;
  searchState: Partial<FiltersState>;
};

export type CreateSavedSearchData = Omit<
  SavedSearchData,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateSavedSearchData = {
  id: SavedSearchData["id"];
} & Partial<SavedSearchData>;

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
  savedSearches: SavedSearchData[];
  getSavedSearchesLoading: boolean;
};

const initialState: UserState = {
  currentUser: null,
  previousFavoriteIds: [],
  favoriteListings: [],
  getFavoriteListingsLoading: false,
  savedSearches: [],
  getSavedSearchesLoading: false
};

export const getCurrentUser = createAppAsyncThunk<
  UserState["currentUser"] | null
>("user/getCurrentUser", async () => {
  const res =
    await axiosInstance.get<UserState["currentUser"]>("/api/current_user");
  return res.data;
});

/**
 * Optimistically updates currentUser.favoriteIds with the given listingId. Adds the ID if it doesn't exist, otherwise
 * removes it.
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

export const getSavedSearches = createAppAsyncThunk<
  SavedSearchData[],
  User["id"]
>("user/getSavedSearches", async (userId) => {
  const res = await axiosInstance.get(`/api/saved_searches/${userId}`);
  return res.data;
});

export const updateSavedSearch = createAppAsyncThunk<
  SavedSearchData,
  UpdateSavedSearchData
>("user/updateSavedSearch", async (savedSearchUpdate) => {
  const res = await axiosInstance.put<SavedSearchData>(
    `/api/saved_search/${savedSearchUpdate.id}`,
    omit(savedSearchUpdate, "id")
  );
  return res.data;
});

export const deleteSavedSearch = createAppAsyncThunk<
  SavedSearchData["id"],
  SavedSearchData["id"]
>("user/deleteSavedSearch", async (id) => {
  await axiosInstance.delete<DefaultAPIResponse>(`/api/saved_search/${id}`);
  return id;
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

    // if the request to add the favorite fails for some reason, undo the optimistic update that added it to
    // currentUser.favoriteIds.
    builder.addCase(toggleFavorite.rejected, (state, action) => {
      console.error(action.error);
      if (!state.currentUser) return;
      state.currentUser.favoriteIds = state.previousFavoriteIds;
    });

    builder.addCase(getSavedSearches.pending, (state) => {
      state.getSavedSearchesLoading = true;
    });

    builder.addCase(getSavedSearches.fulfilled, (state, action) => {
      state.savedSearches = action.payload;
      state.getSavedSearchesLoading = false;
    });

    builder.addCase(getSavedSearches.rejected, (state) => {
      state.getSavedSearchesLoading = false;
    });

    builder.addCase(updateSavedSearch.fulfilled, (state, action) => {
      const index = state.savedSearches.findIndex(
        (s) => s.id === action.payload.id
      );
      state.savedSearches[index] = action.payload;
    });

    builder.addCase(updateSavedSearch.rejected, (_state, action) =>
      console.error(action.error)
    );

    builder.addCase(deleteSavedSearch.fulfilled, (state, action) => {
      state.savedSearches = state.savedSearches.filter(
        (s) => s.id !== action.payload
      );
    });

    builder.addCase(deleteSavedSearch.rejected, (_state, action) => {
      console.error(action.error);
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

export const selectSavedSearches = (state: AppState) =>
  state.user.savedSearches;

export const selectGetSavedSearchesLoading = (state: AppState) =>
  state.user.getSavedSearchesLoading;

export default userSlice.reducer;
