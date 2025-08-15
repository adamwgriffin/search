import type { SearchParamsInit } from "@/types";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import type {
  SearchState,
  SearchStateUpdate
} from "@/zod_schemas/searchStateSchema";
import { SearchTypes } from "./filter";
import { hasProperties } from "@/lib";

export const NonGeocodeParams: ReadonlyArray<keyof SearchState> = Object.freeze(
  ["bounds", "boundary_id", "zoom", "page_index"]
);

/**
 * Params to keep when when clearing filters from search state
 */
export const ClearFiltersParams: ReadonlyArray<keyof SearchState> =
  Object.freeze([
    "address",
    "place_id",
    "address_types",
    "bounds",
    "boundary_id",
    "zoom"
  ]);

/**
 * Keep track of a subset of Listing Service param defaults so that we can avoid
 * sending them in the request if the service would behave this way be default
 * anyway
 */
export const ParamDefaults = Object.freeze({
  page_index: 0,
  sort_by: "listedDate",
  sort_direction: "desc",
  search_type: SearchTypes.Buy,
  include_pending: false,
  open_houses: false,
  sold_in_last: 730
} satisfies SearchState);

/**
 * Remove params marked for removal, as well as params that use default values,
 * or params that otherwise could cause a conflict. Setting a param to the
 * falsey values below indicates indicates that it was marked for removal.
 */
export function removeUnwantedParams(params: SearchStateUpdate): SearchState {
  return omitBy(params, (value, key) => {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      isEqual(ParamDefaults[key as keyof typeof ParamDefaults], value)
    );
  });
}

export function objectToQueryString(params: SearchState) {
  // Casting params as SearchParamsInit because the current type provided by
  // Typescript for this is not correct
  return new URLSearchParams(params as SearchParamsInit)
    .toString()
    .replace(/%2C/g, ","); // Don't encode commas in url params
}

export function buildUrl(path: string, params?: object) {
  const queryString = params && objectToQueryString(params);
  return queryString ? `${path}?${queryString}` : path;
}

export function getUpdatedParams(
  currentParams: SearchState,
  newParams: SearchStateUpdate
) {
  // Only keep the page_index if it was specifically added to the update in
  // newParams. Any other type of search adjustment should request results
  // starting on the first page
  const mergedParams = {
    ...omit(currentParams, "page_index"),
    ...newParams
  };
  return removeUnwantedParams(mergedParams);
}

/**
 * Get bounds & zoom from Google Map object to updates the search state
 */
export function getNewSearchStateFromMap(
  map: google.maps.Map,
  boundaryId: string | undefined
) {
  const bounds = map.getBounds()?.toUrlValue();
  if (!bounds) throw new Error("No bounds present in map instance");
  const params: SearchStateUpdate = { bounds };
  if (boundaryId) {
    params.boundary_id = boundaryId;
  }
  const zoom = map.getZoom();
  if (zoom) {
    params.zoom = zoom;
  }
  return params;
}
