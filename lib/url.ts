import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import type { FiltersState } from "../store/filters/filtersTypes";
import type { PropertyType } from "./property_types";
import type { SortType } from "../types/listing_service_params_types";

export interface ListingURLSearchParams {
  location: string;
  rental: boolean;
  sold: boolean;
  "property-types": string;
  "sort-by": SortType;
  "page-index": number;
  "price-min": number;
  "price-max": number;
  "beds-min": number;
  "baths-min": number;
  "sqft-min": number;
  "sqft-max": number;
  "lot-size-min": number;
  "year-built-min": number;
  "year-built-max": number;
  "include-pending": boolean;
  waterfront: boolean;
  view: boolean;
  fireplace: boolean;
  basement: boolean;
  garage: boolean;
  "new-construction": boolean;
  pool: boolean;
  "air-conditioning": boolean;
  "open-house": boolean;
  [key: string]: any;
}

export const addUrlToBrowserHistory = (url: string) => {
  const currentUrl = window.location.href;
  history.replaceState({}, "", url);
  history.replaceState({}, "", currentUrl);
};

// We need to sync the FilterState with the search url. each time the location
// changes, or a filter is added or removed, we need to update the url with the
// minimum amount of params that are needed to represent the new state. This
// means that we don't want to add any params to the url that are the same as
// the default state.
export const searchStateToListingSearchURLParams = (
  filterState: Partial<FiltersState>
) => {
  const filterParams: Partial<ListingURLSearchParams> = {};
  Object.entries(filterState).forEach(([key, value]) => {
    switch (key) {
      case "locationSearchField":
        if (typeof value === "string") {
          filterParams.location = value
            .split(",")
            .map((s) => encodeURIComponent(s.trim()))
            .join("--");
        }
        break;
      case "propertyTypes":
        filterParams["property-types"] = value.join(",");
        break;
      default:
        filterParams[kebabCase(key)] = value;
        break;
    }
  });
  return filterParams;
};

// On first load, we need to get the url, parse it's params and map then them to
// the state so that we can do the initial search correctly
export const listingSearchURLParamsToSearchState = (
  urlSearchParams: URLSearchParams
): Partial<FiltersState> => {
  const filtersState: Partial<FiltersState> = {};
  for (const [key, value] of urlSearchParams.entries()) {
    switch (key) {
      case "location":
        filtersState.locationSearchField = decodeURIComponent(value)
          .split("--")
          .join(", ");
        break;
      case "property-types":
        filtersState.propertyTypes = value.split(",") as PropertyType[];
        break;
      case "search-type":
      case "sort-by":
      case "sort-direction":
        filtersState[camelCase(key)] = value;
        break;
      default:
        filtersState[camelCase(key)] = JSON.parse(value);
        break;
    }
  }
  return filtersState;
};
