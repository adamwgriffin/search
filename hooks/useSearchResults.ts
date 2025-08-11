import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchQueryOptions } from "~/lib/queries";

export function useSearchResults() {
  const searchParams = useSearchParams();

  return useQuery(searchQueryOptions(searchParams));
}
