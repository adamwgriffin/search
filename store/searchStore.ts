import { type SearchState } from "@/zod_schemas/searchStateSchema";
import { create } from "zustand";

export const useSearchStore = create<SearchState>()(() => ({}));

// Replace the whole state rather than merging, since the new search state
// should only contain the params from the current URL
export const setSearch = (searchState: SearchState) =>
  useSearchStore.setState(searchState, true);
