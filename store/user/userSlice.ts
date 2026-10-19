import type { SearchState } from "@/zod_schemas/searchStateSchema";
import type { SavedSearch } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/http";
import { createAppAsyncThunk } from "../../lib/store_helpers";

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

  initialState: {},

  reducers: {}
});

export default userSlice.reducer;
