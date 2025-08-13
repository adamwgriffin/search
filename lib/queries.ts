import { queryOptions } from "@tanstack/react-query";
import { SearchState } from "~/zod_schemas/searchStateSchema";
import { fetchListings } from "~/lib/fetchListings";

export function searchQueryOptions(searchParams: SearchState) {
  return queryOptions({
    // Run fetchListings() every time search params change
    queryKey: ["search", searchParams.toString()],
    queryFn: () => fetchListings(searchParams),
    staleTime: 1000 * 60
  });
}
