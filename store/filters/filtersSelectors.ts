import type { AppState } from "..";
import type {
  PriceRangeFilters,
  BedsAndBathsFilters,
  SquareFeetRangeFilters,
  YearBuiltRangeFilters,
  SortFilters,
  FeatureFilters,
  FiltersState
} from "./filtersTypes";
import { createSelector } from "@reduxjs/toolkit";
import pick from "lodash/pick";
import omitBy from "lodash/omitBy";
import isEqual from "lodash/isEqual";
import { initialState } from "./filtersSlice";

export const selectFilters = (state: AppState) => state.filters;

export const selectSearchType = (state: AppState) => state.filters.searchType;

export const selectLocationSearchField = (state: AppState) =>
  state.filters.locationSearchField;

export const selectOpenHouse = (state: AppState) => state.filters.openHouse;

export const selectIncludePending = (state: AppState) =>
  state.filters.includePending;

export const selectSoldInLast = (state: AppState) => state.filters.soldInLast;

export const selectPropertyTypes = (state: AppState) =>
  state.filters.propertyTypes;

export const selectPriceRange = createSelector(
  selectFilters,
  (filters): PriceRangeFilters => pick(filters, ["priceMin", "priceMax"])
);

export const selectBedBathFilters = createSelector(
  selectFilters,
  (filters): BedsAndBathsFilters => pick(filters, ["bedsMin", "bathsMin"])
);

export const selectSquareFeetRange = createSelector(
  selectFilters,
  (filters): SquareFeetRangeFilters => pick(filters, ["sqftMin", "sqftMax"])
);

export const selectYearBuiltRange = createSelector(
  selectFilters,
  (filters): YearBuiltRangeFilters =>
    pick(filters, ["yearBuiltMin", "yearBuiltMax"])
);

export const selectFeatures = createSelector(
  selectFilters,
  (filters): FeatureFilters =>
    pick(filters, [
      "waterfront",
      "view",
      "fireplace",
      "basement",
      "garage",
      "newConstruction",
      "pool",
      "airConditioning"
    ])
);

export const selectSortBy = createSelector(
  selectFilters,
  (filters): SortFilters => pick(filters, ["sortBy", "sortDirection"])
);

export const selectSearchState = createSelector(
  selectFilters,
  (state: FiltersState): Partial<FiltersState> => {
    return omitBy(state, (value, key) => {
      // always include locationSearchField as long as it has a value
      if (key === "locationSearchField" && value) {
        return false;
      }
      return (
        value === null ||
        ["pageSize"].includes(key) ||
        isEqual(initialState[key], value)
      );
    });
  }
);
