"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
  ReadonlyURLSearchParams
} from "next/navigation";
import {
  getUpdatedQueryString,
  NonGeocodeParams,
  objectToQueryString
} from "~/lib/listingSearchParams";
import {
  type SearchParams,
  type SearchParamsUpdate,
  searchParamsSchema
} from "~/zod_schemas/searchParamsSchema";
import omit from "lodash/omit";
import { parseAndStripInvalidProperties } from "~/zod_schemas";

type NewLocationState =
  | { address: string }
  | { place_id: string; address_types: string };

type SearchParamsContextValue = {
  searchParamsState: Readonly<SearchParams>;
  updateSearchParams: (newParams: SearchParamsUpdate) => void;
  setNewLocation: (newLocationState: NewLocationState) => void;
  clearSearchParamsFilters: () => void;
};

const SearchParamsContext = createContext<SearchParamsContextValue | undefined>(
  undefined
);

function getStateFromParams(
  searchParams: ReadonlyURLSearchParams
): Readonly<SearchParams> {
  const params = Object.fromEntries(searchParams.entries());
  const parsed = parseAndStripInvalidProperties(searchParamsSchema, params);
  return Object.freeze(parsed);
}

export const SearchParamsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchParamsState, setSearchParamsState] = useState<
    Readonly<SearchParams>
  >(getStateFromParams(searchParams));

  useEffect(() => {
    setSearchParamsState(getStateFromParams(searchParams));
  }, [searchParams]);

  const updateSearchParams = (newParams: SearchParamsUpdate) => {
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

  const clearSearchParamsFilters = () => {
    const address = searchParams.get("address");
    const url = address
      ? `${pathname}?${objectToQueryString({ address })}`
      : pathname;
    router.push(url);
  };

  return (
    <SearchParamsContext.Provider
      value={{
        searchParamsState,
        updateSearchParams,
        setNewLocation,
        clearSearchParamsFilters
      }}
    >
      {children}
    </SearchParamsContext.Provider>
  );
};

export const useSearchParamsState = (): SearchParamsContextValue => {
  const context = useContext(SearchParamsContext);
  if (context === undefined) {
    throw new Error("useSearchState must be used within a SearchStateProvider");
  }
  return context;
};
