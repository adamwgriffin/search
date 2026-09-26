import type { NextPage } from "next";
import GoogleMapsProvider from "../providers/GoogleMapsProvider";
import SearchHeader from "../containers/SearchHeader/SearchHeader";
import SearchResults from "../containers/SearchResults/SearchResults";
import ListingMap from "../containers/ListingMap/ListingMap";
import ListingMapFallback from "@/components/ListingMapFallback/ListingMapFallback";
import SearchModals from "../components/SearchModals";
import styles from "./page.module.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import SearchResultsFallback from "@/components/SearchResultsFallback";
import { Suspense } from "react";

const SearchPage: NextPage = () => {
  return (
    <GoogleMapsProvider>
      <ReactQueryClientProvider>
        <div className={styles.search}>
          <SearchHeader />
          <div className={styles.results}>
            <Suspense fallback={<SearchResultsFallback />}>
              <SearchResults />
            </Suspense>
            <Suspense fallback={<ListingMapFallback />}>
              <ListingMap />
            </Suspense>
          </div>
          {/* <SearchModals /> */}
        </div>
      </ReactQueryClientProvider>
    </GoogleMapsProvider>
  );
};

export default SearchPage;
