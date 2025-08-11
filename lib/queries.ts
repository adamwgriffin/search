import { queryOptions } from "@tanstack/react-query";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { fetchListings } from "~/lib/fetchListings";

export function searchQueryOptions(searchParams: ReadonlyURLSearchParams) {
  return queryOptions({
    // Run fetchListings() every time search params change
    queryKey: ["search", searchParams.toString()],
    queryFn: () => fetchListings(searchParams),
    staleTime: 1000 * 60
  });
}
