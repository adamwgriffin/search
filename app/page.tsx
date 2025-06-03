"use client";

import type { NextPage } from "next";
import { useGetCurrentUserIfAuthenticated } from "../hooks/get_current_user_if_authenticated_hook";
import { useSyncSearchStateWithUrl } from "../hooks/sync_search_state_with_url_hook";
import GoogleMapsProvider from "../providers/GoogleMapsProvider";
import SearchHeader from "../containers/SearchHeader/SearchHeader";
import SearchResults from "../containers/SearchResults/SearchResults";
import ListingMap from "../containers/ListingMap/ListingMap";
import SearchModals from "../components/SearchModals";
import styles from "./page.module.css";

const SearchPage: NextPage = () => {
  // We want to get the currentUser so that we can display their favorites on
  // the listing cards
  useGetCurrentUserIfAuthenticated();
  useSyncSearchStateWithUrl();

  return (
    <GoogleMapsProvider>
      <div className={styles.search}>
        <SearchHeader />
        <div className={styles.results}>
          <SearchResults />
          <ListingMap />
        </div>
        <SearchModals />
      </div>
    </GoogleMapsProvider>
  );
};

export default SearchPage;
