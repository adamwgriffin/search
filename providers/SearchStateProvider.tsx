"use client";

import { SearchPathname } from "@/config";
import {
  buildUrl,
  ClearFiltersParams,
  getUpdatedParams,
  NonGeocodeParams,
  ParamDefaults
} from "@/lib/listingSearchParams";
import { parseAndStripInvalidProperties } from "@/zod_schemas";
import {
  searchStateSchema,
  type NewLocationState,
  type SearchState,
  type SearchStateUpdate,
  type Searchtype
} from "@/zod_schemas/searchStateSchema";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type SearchStateContextValue = {
  searchState: Readonly<SearchState>;
  searchType: Searchtype;
  setSearchState: (newParams: SearchStateUpdate) => void;
  setNewLocation: (newLocationState: NewLocationState) => void;
  setSearchType: (newSearchType: Searchtype) => void;
  clearFilters: () => void;
};

const SearchStateContext = createContext<SearchStateContextValue | undefined>(
  undefined
);

export const SearchStateProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchState: Readonly<SearchState> = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsed = parseAndStripInvalidProperties(searchStateSchema, params);
    return Object.freeze(parsed);
  }, [searchParams]);

  const setSearchState = (newParams: SearchStateUpdate) => {
    const params = getUpdatedParams(searchState, newParams);
    router.push(buildUrl(SearchPathname, params));
  };

  const setNewLocation = (newLocationState: NewLocationState) => {
    // Remove params for searching current location with a geospatial search.
    // Since we're now going to be geocoding a new location, we only want filter
    // params. Remove address/place_id for existing location so that we can
    // replace it with new state
    const params = omit(searchState, [
      ...NonGeocodeParams,
      "address",
      "place_id",
      "address_types"
    ]);
    Object.assign(params, newLocationState);
    router.push(buildUrl(SearchPathname, params));
  };

  const setSearchType = (newSearchType: Searchtype) => {
    const params = pick<SearchState>(searchState, ClearFiltersParams);
    if (newSearchType !== ParamDefaults.search_type) {
      params.search_type = newSearchType;
    }
    router.push(buildUrl(SearchPathname, params));
  };

  const clearFilters = () => {
    const params = pick(searchState, ClearFiltersParams);
    router.push(buildUrl(SearchPathname, params));
  };

  return (
    <SearchStateContext.Provider
      value={{
        searchState,
        searchType: searchState.search_type || ParamDefaults.search_type,
        setSearchState,
        setNewLocation,
        setSearchType,
        clearFilters
      }}
    >
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = (): SearchStateContextValue => {
  const context = useContext(SearchStateContext);
  if (context === undefined) {
    throw new Error("useSearchState must be used within a SearchStateProvider");
  }
  return context;
};
