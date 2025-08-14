"use client";

import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import pick from "lodash/pick";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  ClearFiltersParams,
  getUpdatedQueryString,
  NonGeocodeParams,
  objectToQueryString,
  ParamDefaults
} from "@/lib/listingSearchParams";
import { parseAndStripInvalidProperties } from "@/zod_schemas";
import {
  searchStateSchema,
  type SearchState,
  type SearchStateUpdate
} from "@/zod_schemas/searchStateSchema";

type NewLocationState =
  | { address: string }
  | { place_id: string; address_types: string };

type Searchtype = Exclude<SearchState["search_type"], undefined>;

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

function getStateFromParams(
  searchParams: ReadonlyURLSearchParams
): Readonly<SearchState> {
  const params = Object.fromEntries(searchParams.entries());
  const parsed = parseAndStripInvalidProperties(searchStateSchema, params);
  return Object.freeze(parsed);
}

export const SearchStateProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchParamsState, setSearchParamsState] = useState<
    Readonly<SearchState>
  >(getStateFromParams(searchParams));

  useEffect(() => {
    setSearchParamsState(getStateFromParams(searchParams));
  }, [searchParams]);

  const setSearchState = (newParams: SearchStateUpdate) => {
    const updatedQueryString = getUpdatedQueryString(
      searchParamsState,
      newParams
    );
    const url =
      updatedQueryString === ""
        ? pathname
        : `${pathname}?${updatedQueryString}`;
    router.push(url);
  };

  const setNewLocation = (newLocationState: NewLocationState) => {
    // Remove params for searching current location with a geospatial search.
    // Since we're now going to be geocoding a new location, we only want filter
    // params. Remove address/place_id for existing location so that we can
    // replace it with new state
    const params = omit(searchParamsState, [
      ...NonGeocodeParams,
      "address",
      "place_id",
      "address_types"
    ]);
    Object.assign(params, newLocationState);
    router.push(`${pathname}?${objectToQueryString(params)}`);
  };

  const setSearchType = (newSearchType: Searchtype) => {
    const newParams = pick<SearchState>(searchParamsState, ClearFiltersParams);
    if (newSearchType !== ParamDefaults.search_type) {
      newParams.search_type = newSearchType;
    }
    router.push(`${pathname}?${objectToQueryString(newParams)}`);
  };

  const clearFilters = () => {
    const keptParams = pick(searchParamsState, ClearFiltersParams);
    const url = isEmpty(keptParams)
      ? pathname
      : `${pathname}?${objectToQueryString(keptParams)}`;
    router.push(url);
  };

  return (
    <SearchStateContext.Provider
      value={{
        searchState: searchParamsState,
        searchType: searchParamsState.search_type || ParamDefaults.search_type,
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
