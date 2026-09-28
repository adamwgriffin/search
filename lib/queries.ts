import { queryOptions } from "@tanstack/react-query";
import { fetchListings } from "@/lib/fetchListings";
import { type SearchState } from "@/zod_schemas/searchStateSchema";

export function searchQueryOptions(searchState: SearchState) {
  return queryOptions({
    // Run fetchListings() every time searchState changes. We're tracking based
    // on the object reference change because the object is read-only and should
    // only be able to change when the underlying searchParams url object it
    // depends on changes.
    queryKey: ["search", searchState],
    queryFn: () => fetchListings(searchState),
    staleTime: 1000 * 60
  });
}
