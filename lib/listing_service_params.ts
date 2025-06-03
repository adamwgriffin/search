import type {
  ListingServiceParamFilters,
  ListingServiceParams
} from "../types/listing_service_params_types";
import type { FiltersState } from "../store/filters/filtersTypes";
import type { AutocompleteState } from "../store/autocomplete/autocompleteSlice";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import snakeCase from "lodash/snakeCase";
import { SearchTypes } from "./filter";

/**
 * Keep track of a subset of Listing Service param defaults so that we can avoid sending them in the request if the
 * service would behave this way be default anyway
 */
export const DefaultListingServiceParams: ListingServiceParams = Object.freeze({
  page_index: 0,
  page_size: 20,
  price_min: 0,
  beds_min: 0,
  baths_min: 0,
  sort_by: "listedDate",
  sort_direction: "desc"
});

export const BooleanParams = Object.freeze([
  "waterfront",
  "view",
  "fireplace",
  "basement",
  "garage",
  "new_construction",
  "virtual_tour",
  "pool",
  "air_conditioning"
]);

export const convertFilterKeysToProperCase = (
  filters: ListingServiceParamFilters
) => {
  return Object.entries(filters).reduce(
    (params: ListingServiceParams, [key, value]) => {
      params[snakeCase(key)] = value;
      return params;
    },
    {}
  );
};

/**
 * We want to avoid including parameters with a boolean value that is false in most circumstances. We only care about
 * filtering on those that are true.
 */
export const isFalseBooleanParam = (param: string, value: unknown) => {
  return BooleanParams.includes(param) && value === false;
};

/**
 * Remove attributes from filters state that are not actual params that the Listing Service recognizes. Most of these
 * are used to compute values for actual service params instead of being used directly.
 */
export const removeNonListingServiceParamFilters = (
  filters: FiltersState
): ListingServiceParamFilters => {
  return omit(
    filters,
    "searchType",
    "locationSearchField",
    "propertyTypes",
    "openHouse",
    "includePending"
  );
};

export const removeUnecessaryParams = (
  params: ListingServiceParams
): ListingServiceParams => {
  return omitBy(params, (value, param) => {
    return (
      value === null ||
      DefaultListingServiceParams[param] === value ||
      isFalseBooleanParam(param, value)
    );
  });
};

/**
 * adds additional listing service params based on certain filter state values
 */
export const paramsDerivedFromFilterState = (filters: FiltersState) => {
  const params: ListingServiceParams = {};
  if (filters.propertyTypes.length) {
    params.property_type = filters.propertyTypes.join(",");
  }
  if (filters.openHouse) {
    params.open_house_after = new Date().toISOString();
  }
  if (filters.searchType === SearchTypes.Buy && filters.includePending) {
    params.status = "active,pending";
  }
  if (filters.searchType === SearchTypes.Rent) {
    params.rental = true;
  }
  if (filters.searchType === SearchTypes.Sold) {
    params.status = "sold";
    params.sold_in_last = filters.soldInLast;
  }
  return params;
};

/**
 * The main entry point for putting the filters state into the correct shape for sending params to the Listing Service
 */
export const convertFiltersToListingServiceParams = (
  filters: FiltersState
): ListingServiceParams => {
  const listingServiceParams = convertFilterKeysToProperCase(
    removeNonListingServiceParamFilters(filters)
  );
  return {
    ...removeUnecessaryParams(listingServiceParams),
    ...paramsDerivedFromFilterState(filters)
  };
};

/**
 * Add params specific to a Listing Service geocode search request
 */
export const addGeocodeParams = (
  params: ListingServiceParams,
  prediction: AutocompleteState["selectedAutcompletePlacePrediction"],
  locationSearchField: string
) => {
  // If the user selected a prediction from the autocomplete, use the place_id inside it. This is more effecient for the
  // Listing Service since it can potentially avoid doing a geocode request when the place_id is available. We're
  // checking the locationSearchField here in case the user changed the text there and just clicked the search button
  // without choosing a new autocomplete prediction, in which case the old place_id would no longer be accurate
  if (prediction?.description === locationSearchField) {
    params.place_id = prediction.place_id;
    params.address_types = prediction.types.join(",");
  } else {
    params.address = locationSearchField;
  }
  return params;
};
