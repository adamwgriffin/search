"use client";

import type { NextPage } from "next";
import GoogleMapsProvider from "../providers/GoogleMapsProvider";
import { SearchStateProvider } from "~/providers/SearchStateProvider";
import SearchHeader from "../containers/SearchHeader/SearchHeader";
import SearchResults from "../containers/SearchResults/SearchResults";
import ListingMap from "../containers/ListingMap/ListingMap";
import SearchModals from "../components/SearchModals";
import styles from "./page.module.css";
import ReactQueryClientProvider from "~/providers/ReactQueryClientProvider";
import { Suspense } from "react";

const SearchPage: NextPage = () => {
  return (
    <GoogleMapsProvider>
      <SearchStateProvider>
        <ReactQueryClientProvider>
          <div className={styles.search}>
            <SearchHeader />
            <div className={styles.results}>
              <Suspense>
                <SearchResults />
              </Suspense>
              <Suspense>
                <ListingMap />
              </Suspense>
            </div>
            <SearchModals />
          </div>
        </ReactQueryClientProvider>
      </SearchStateProvider>
    </GoogleMapsProvider>
  );
};

export default SearchPage;
