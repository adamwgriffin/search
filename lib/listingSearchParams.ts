import type { SearchParamsInit } from "~/types";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import type {
  SearchParams,
  SearchParamsUpdate
} from "~/zod_schemas/searchParamsSchema";
import { SearchTypes } from "./filter";

export const NonGeocodeParams = ["bounds", "boundary_id", "zoom", "page_index"];

/**
 * Keep track of a subset of Listing Service param defaults so that we can avoid
 * sending them in the request if the service would behave this way be default
 * anyway
 */
export const ParamDefaults: Partial<SearchParams> = Object.freeze({
  page_index: 0,
  sort_by: "listedDate",
  sort_direction: "desc",
  search_type: SearchTypes.Buy,
  include_pending: false,
  open_houses: false
});

/**
 * Remove params marked for removal, as well as params that use default values,
 * or params that otherwise could cause a conflict. Setting a param to the
 * falsey values below indicates indicates that it was marked for removal.
 */
export function removeUnwantedParams(params: SearchParamsUpdate) {
  return omitBy(params, (value, key) => {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      isEqual(ParamDefaults[key as keyof SearchParamsUpdate], value)
    );
  });
}

export function objectToQueryString(params: SearchParams) {
  // Casting params as SearchParamsInit because the current type provided by
  // Typescript for this is not correct
  return new URLSearchParams(params as SearchParamsInit)
    .toString()
    .replace(/%2C/g, ","); // Don't encode commas in url params
}

export function getUpdatedParams(
  currentParams: SearchParams,
  newParams: SearchParamsUpdate
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

export function getUpdatedQueryString(
  currentParams: SearchParams,
  newParams: SearchParamsUpdate
) {
  return objectToQueryString(getUpdatedParams(currentParams, newParams));
}

export function getNewLocationQueryString(
  currentParams: SearchParams,
  newLocationParams: SearchParams
) {
  // Remove params for searching current location with a geospatial search
  // since we're now going to be geocoding a new location. We no only want
  // filter params.
  const filterParams = omit(currentParams, NonGeocodeParams);
  return objectToQueryString({ ...filterParams, ...newLocationParams });
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
  const params: SearchParamsUpdate = { bounds };
  if (boundaryId) {
    params.boundary_id = boundaryId;
  }
  const zoom = map.getZoom();
  if (zoom) {
    params.zoom = zoom;
  }
  return params;
}
