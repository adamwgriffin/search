import { useSearchState } from "~/providers/SearchStateProvider";
import { useQuery } from "@tanstack/react-query";
import { searchQueryOptions } from "~/lib/queries";

export function useSearchResults() {
  const { searchState } = useSearchState();

  return useQuery(searchQueryOptions(searchState));
}
