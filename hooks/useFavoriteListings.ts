import { useQuery } from "@tanstack/react-query";
import type { CurrentUser } from "@/app/api/current_user/route";
import type { Listing } from "@/types/listing_types";

type FavoriteListingsResponse = {
  listings: Listing[];
};

export function useFavoriteListings(favoriteIds?: CurrentUser["favoriteIds"]) {
  return useQuery({
    queryKey: ["favoriteListings", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds?.length) return [];

      const response = await fetch(`/api/listings/${favoriteIds.join(",")}`);
      if (!response.ok) throw new Error("Failed to fetch favorite listings");

      const data: FavoriteListingsResponse = await response.json();
      return data.listings;
    },
    enabled: favoriteIds !== undefined
  });
}
