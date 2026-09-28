import { useSearchState } from "@/hooks/useSearchState";
import { useQuery } from "@tanstack/react-query";
import { searchQueryOptions } from "@/lib/queries";

export function useSearchResults() {
  const { searchState } = useSearchState();

  return useQuery(searchQueryOptions(searchState));
}
