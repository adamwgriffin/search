"use client";

import type { NextPage } from "next";
import GoogleMapsProvider from "../providers/GoogleMapsProvider";
import { SearchStateProvider } from "@/providers/SearchStateProvider";
import SearchHeader from "../containers/SearchHeader/SearchHeader";
import SearchResults from "../containers/SearchResults/SearchResults";
import ListingMap from "../containers/ListingMap/ListingMap";
import SearchModals from "../components/SearchModals";
import styles from "./page.module.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { Suspense } from "react";

// TODO: We're using the <Suspense> below as a temporary workaround for the fact that
// SearchStateProvider uses the useSearchParams hook, which will opt the entire
// page into client-side rendering. A better solution would be to isolate any
// code that requires useSearchParams and move it into the child client
// components that need it, but there is so much code involed that doing this
// would take a major refactor. See
// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
const SearchPage: NextPage = () => {
  return (
    <GoogleMapsProvider>
      <ReactQueryClientProvider>
        <Suspense>
          <SearchStateProvider>
            <div className={styles.search}>
              <SearchHeader />
              <div className={styles.results}>
                <SearchResults />
                <ListingMap />
              </div>
              <SearchModals />
            </div>
          </SearchStateProvider>
        </Suspense>
      </ReactQueryClientProvider>
    </GoogleMapsProvider>
  );
};

export default SearchPage;
