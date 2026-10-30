import { useMutation } from "@tanstack/react-query";
import type { ISavedSearch } from "@/models/SavedSearchModel";

// A saved search as serialized to JSON by the API
export type SavedSearchData = Omit<
  ISavedSearch,
  "userId" | "createdAt" | "updatedAt"
> & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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