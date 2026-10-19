import { useMutation } from "@tanstack/react-query";
import type { SavedSearch } from "@prisma/client";
import type { SearchState } from "@/zod_schemas/searchStateSchema";

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

export function useCreateSavedSearch() {
  return useMutation({
    mutationFn: async (savedSearch: CreateSavedSearchData) => {
      const response = await fetch("/api/saved_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedSearch)
      });
      if (!response.ok) throw new Error("Failed to create saved search");

      return (await response.json()) as SavedSearchData;
    }
  });
}