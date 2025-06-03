"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/app_hooks";
import { useOpenListingDetail } from "../../hooks/open_listing_detail_hook";
import { useGetCurrentUserIfAuthenticated } from "../../hooks/get_current_user_if_authenticated_hook";
import {
  getFavoriteListings,
  selectFavoriteListings,
  selectGetFavoriteListingsLoading
} from "../../store/user/userSlice";
import ListingCards from "../../components/listings/ListingCards/ListingCards";

const FavoritesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const favoriteListings = useAppSelector(selectFavoriteListings);
  const getFavoriteListingsLoading = useAppSelector(
    selectGetFavoriteListingsLoading
  );
  const currentUser = useGetCurrentUserIfAuthenticated();
  const openListingDetail = useOpenListingDetail(false);

  useEffect(() => {
    if (currentUser?.favoriteIds.length) {
      dispatch(getFavoriteListings());
    }
  }, [dispatch, currentUser?.favoriteIds]);

  return (
    <ListingCards
      listings={favoriteListings}
      listingSearchRunning={!currentUser || getFavoriteListingsLoading}
      onListingCardClick={openListingDetail}
    />
  );
};

export default FavoritesList;
