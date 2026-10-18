"use client";

import { useOpenListingDetail } from "@/hooks/open_listing_detail_hook";
import { useGetCurrentUser } from "@/hooks/get_current_user_hook";
import { useFavoriteListings } from "@/hooks/useFavoriteListings";
import ListingCards from "@/components/listings/ListingCards/ListingCards";

const FavoritesList: React.FC = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: favoriteListings = [], isLoading } = useFavoriteListings(
    currentUser?.favoriteIds
  );
  const openListingDetail = useOpenListingDetail(false);

  return (
    <ListingCards
      listings={favoriteListings}
      listingSearchRunning={!currentUser || isLoading}
      onListingCardClick={openListingDetail}
    />
  );
};

export default FavoritesList;
