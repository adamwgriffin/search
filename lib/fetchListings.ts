import omit from "lodash/omit";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { http } from "~/lib/http";
import type { URLParams } from "~/types";
import type { ListingSearchResponse } from "~/types";
import { SearchTypes } from "./filter";
import { ListingFilterParams } from "~/zod_schemas/listingSearchParamsSchema";
import { DefaultSoldInLast } from "~/config";
import { ParamDefaults } from "./listingSearchParams";

function removeNonListingServiceParams(params: URLParams) {
  return omit(
    params,
    "bounds",
    "boundary_id",
    "zoom",
    "open_houses",
    "include_pending",
    "search_type"
  );
}

function removeNonGeospatialParams(params: URLParams) {
  return omit(params, "address", "place_id");
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
function paramsComputedFromState(state: URLParams) {
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
    params.sold_in_last = Number(state.sold_in_last ?? ParamDefaults.sold_in_last);
  }
  return params;
}

function paramsForGeospatialSearch(params: URLParams) {
  if (typeof params.bounds !== "string") {
    throw new Error("Bounds not included in params");
  }
  const listingServiceBounds = convertBoundsParamToListingServiceBounds(
    params.bounds
  );
  const computedParams = paramsComputedFromState(params);
  const newParams = removeNonListingServiceParams(
    removeNonGeospatialParams(params)
  );
  return { ...newParams, ...computedParams, ...listingServiceBounds };
}

function paramsForNewLocationSearch(
  params: URLParams
): Partial<ListingFilterParams> {
  const computedParams = paramsComputedFromState(params);
  const newParams = removeNonListingServiceParams(params);
  return { ...newParams, ...computedParams };
}

async function searchNewLocation(params: URLParams) {
  return http<ListingSearchResponse>(
    "/api/listing/search/geocode",
    paramsForNewLocationSearch(params)
  );
}

async function searchCurrentLocation(params: URLParams) {
  return http<ListingSearchResponse>(
    `/api/listing/search/boundary/${params.boundary_id}`,
    paramsForGeospatialSearch(params)
  );
}

async function searchBounds(params: URLParams) {
  return http<ListingSearchResponse>(
    "/api/listing/search/bounds",
    paramsForGeospatialSearch(params)
  );
}

export async function fetchListings(searchParams: ReadonlyURLSearchParams) {
  if (searchParams.size === 0) return {};
  const params = Object.fromEntries(searchParams.entries());
  const location = params.place_id || params.address;
  const { bounds, boundary_id } = params;
  // The user entered a new search in the search field
  if (location && !bounds) {
    return await searchNewLocation(params);
  }
  // We have previously performed a new search and now we are performing subsequent
  // searches on the same location with different criteria
  if (location && bounds && boundary_id) {
    return await searchCurrentLocation(params);
  }
  // The user removed the location boundary so we are just performing searches
  // on the bounds of the map viewport
  if (bounds && !location && !boundary_id) {
    return await searchBounds(params);
  }
  return {};
}
