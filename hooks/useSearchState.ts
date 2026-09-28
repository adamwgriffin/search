import { SearchPathname } from "@/config";
import { useAppDispatch, useAppSelector } from "@/hooks/app_hooks";
import {
  buildUrl,
  ClearFiltersParams,
  getUpdatedParams,
  NonGeocodeParams,
  ParamDefaults
} from "@/lib/listingSearchParams";
import { setSearch } from "@/store/search/searchSlice";
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
import { useEffect } from "react";

export function useSearchState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchState: SearchState = useAppSelector((state) => state.search);
  const searchType: Searchtype = useAppSelector(
    (state) => state.search.search_type || ParamDefaults.search_type
  );

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsed = parseAndStripInvalidProperties(searchStateSchema, params);
    dispatch(setSearch(parsed));
  }, [searchParams]);

  const setSearchState = (newParams: SearchStateUpdate) => {
    // TODO: this should be a selector instead
    const params = getUpdatedParams(searchState, newParams);
    router.push(buildUrl(SearchPathname, params));
  };

  const setNewLocation = (newLocationState: NewLocationState) => {
    // Remove params for searching current location with a geospatial search.
    // Since we're now going to be geocoding a new location, we only want filter
    // params. Remove address/place_id for existing location so that we can
    // replace it with new state
    // TODO: this should be a selector instead
    const params = omit(searchState, [
      ...NonGeocodeParams,
      "address",
      "place_id",
      "address_types"
    ]);
    Object.assign(params, newLocationState);
    router.push(buildUrl(SearchPathname, params));
  };

  // TODO: This should be a reducer instead
  const setSearchType = (newSearchType: Searchtype) => {
    // TODO: this should be a selector instead
    const params = pick<SearchState>(searchState, ClearFiltersParams);
    if (newSearchType !== ParamDefaults.search_type) {
      params.search_type = newSearchType;
    }
    router.push(buildUrl(SearchPathname, params));
  };

  const clearFilters = () => {
    // TODO: this should be a selector instead
    const params = pick(searchState, ClearFiltersParams);
    router.push(buildUrl(SearchPathname, params));
  };

  return {
    searchState,
    searchType,
    setSearchState,
    setNewLocation,
    setSearchType,
    clearFilters
  };
}
