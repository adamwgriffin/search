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

// We're using <Suspense> boundaries below because the child components make
// extensive use of the useSearchParams hook. Using this hook without a suspense
// boundary would opt the entire page into client-side rendering rather than
// just the components that use it, which could negatively impact performance.
// See https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
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
          <Suspense>
            <SearchModals />
          </Suspense>
        </div>
      </ReactQueryClientProvider>
    </GoogleMapsProvider>
  );
};

export default SearchPage;
