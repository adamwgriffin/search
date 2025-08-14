import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import { http } from "@/lib/http";
import type { ListingSearchResponse } from "@/types";
import { ListingFilterParams } from "@/zod_schemas/listingSearchParamsSchema";
import { type SearchState } from "@/zod_schemas/searchStateSchema";
import { SearchTypes } from "./filter";
import { ParamDefaults } from "./listingSearchParams";

/** Remove params from search state that the listing service does not recognize.
 Some of the params in state are only meant for the app state, or are meant to
 be transformed into more verbose listing service params once when used to make
 a request. */
function removeNonListingServiceParams(
  state: SearchState
): Partial<ListingFilterParams> {
  return omit(
    state,
    "bounds",
    "boundary_id",
    "zoom",
    "open_houses",
    "include_pending",
    "search_type"
  );
}

/** Params that should only be used for a new search with the /geocode endpoint */
function removeNonGeospatialParams(state: SearchState) {
  return omit(state, "address", "place_id", "address_types");
}

function convertBoundsParamToListingServiceBounds(boundsString: string) {
  const [bounds_south, bounds_west, bounds_north, bounds_east] =
    boundsString.split(",");
  return { bounds_south, bounds_west, bounds_north, bounds_east };
}

/**
 * Computes some listing service params based on certain state values that do
 * not have a one-to-one mapping with the equivalent listing service params.
 */
function paramsComputedFromState(
  state: SearchState
): Partial<ListingFilterParams> {
  const params: Partial<ListingFilterParams> = {};
  if (state.open_houses) {
    params.open_house_after = new Date().toISOString();
  }
  const searchType = state.search_type ?? ParamDefaults.search_type;
  if (searchType === SearchTypes.Buy && state.include_pending) {
    params.status = "active,pending";
  }
  if (searchType === SearchTypes.Rent) {
    params.rental = true;
  }
  if (searchType === SearchTypes.Sold) {
    params.status = "sold";
    params.sold_in_last = Number(
      state.sold_in_last ?? ParamDefaults.sold_in_last
    );
  }
  return params;
}

function paramsForGeospatialSearch(
  state: SearchState
): Partial<ListingFilterParams> {
  if (typeof state.bounds !== "string") {
    throw new Error("Bounds not included in params");
  }
  const listingServiceBounds = convertBoundsParamToListingServiceBounds(
    state.bounds
  );
  const computedParams = paramsComputedFromState(state);
  const newParams = removeNonListingServiceParams(
    removeNonGeospatialParams(state)
  );
  return { ...newParams, ...computedParams, ...listingServiceBounds };
}

function paramsForNewLocationSearch(
  state: SearchState
): Partial<ListingFilterParams> {
  const computedParams = paramsComputedFromState(state);
  const newParams = removeNonListingServiceParams(state);
  return { ...newParams, ...computedParams };
}

async function searchNewLocation(state: SearchState) {
  return http<ListingSearchResponse>(
    "/api/listing/search/geocode",
    paramsForNewLocationSearch(state)
  );
}

async function searchCurrentLocation(state: SearchState) {
  return http<ListingSearchResponse>(
    `/api/listing/search/boundary/${state.boundary_id}`,
    paramsForGeospatialSearch(state)
  );
}

async function searchBounds(state: SearchState) {
  return http<ListingSearchResponse>(
    "/api/listing/search/bounds",
    paramsForGeospatialSearch(state)
  );
}

export async function fetchListings(state: SearchState) {
  if (isEmpty(state)) return {};

  const location = state.place_id || state.address;
  const { bounds, boundary_id } = state;
  // The user entered a new search in the search field
  if (location && !bounds) {
    return searchNewLocation(state);
  }
  // We have previously performed a new search and now we are performing subsequent
  // searches on the same location with different criteria
  if (location && bounds && boundary_id) {
    return searchCurrentLocation(state);
  }
  // The user removed the location boundary so we are just performing searches
  // on the bounds of the map viewport
  if (bounds && !location && !boundary_id) {
    return searchBounds(state);
  }
  return {};
}
