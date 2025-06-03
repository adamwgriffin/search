import { subDays } from "date-fns";
import type { FilterQuery } from "mongoose";
import type { IListingModel } from "../models/ListingModel";
import type { GeocodeBoundaryQueryParams } from "../zod_schemas/geocodeBoundarySearchSchema";

/**
 * Generates a MongoDB query object that searches within a min/max range for the given field.
 *
 * @example
 * numberRangeQuery('listPrice', 100000, 200000)
 * // Returns { "listPrice": { $gte: 100000, $lte: 200000 } }
 */
export const numberRangeQuery = (
  field: string,
  min: number | undefined,
  max: number | undefined
) => {
  const query: FilterQuery<IListingModel> = { [field]: {} };
  if (min) {
    query[field].$gte = min;
  }
  if (max) {
    query[field].$lte = max;
  }
  return query;
};

export const openHouseQuery = (
  open_house_after: string | undefined,
  open_house_before: string | undefined
): FilterQuery<IListingModel> => {
  const query: { $gte?: Date; $lte?: Date } = {};
  if (open_house_after) {
    query.$gte = new Date(open_house_after);
  }
  if (open_house_before) {
    query.$lte = new Date(open_house_before);
  }
  return {
    openHouses: {
      $elemMatch: { start: query }
    }
  };
};

/**
 * Convert listing search filter params into an array of MongoDB queries for each filter.
 *
 * @example
 * buildFilterQueries({ "price_min": 100000, "waterfornt": "true" })
 * // Returns [{ "listPrice": { $gte: 100000} }, { "waterfornt": true }]
 */
export const buildFilterQueries = (
  queryParams: GeocodeBoundaryQueryParams
): FilterQuery<IListingModel>[] => {
  // TODO: refactor this. the list is way too long.
  const {
    property_type,
    status,
    price_min,
    price_max,
    beds_min,
    beds_max,
    baths_min,
    baths_max,
    sqft_min,
    sqft_max,
    year_built_min,
    year_built_max,
    lot_size_min,
    lot_size_max,
    waterfront,
    view,
    fireplace,
    basement,
    garage,
    new_construction,
    pool,
    air_conditioning,
    rental,
    sold_in_last,
    open_house_after,
    open_house_before
  } = queryParams;
  const filters = [];

  filters.push({ status: status ? { $in: status.split(",") } : "active" });

  if (property_type) {
    filters.push({
      propertyType: {
        $in: property_type.split(",")
      }
    });
  }
  if (rental === true) {
    filters.push({ rental: true });
  } else {
    // Need to explicitly exclude rentals, otherwise if the request does not supply the rental param it will return
    // everything that has status: active by default
    filters.push({ rental: { $exists: false } });
  }
  if (sold_in_last) {
    filters.push({
      soldDate: {
        $gte: subDays(new Date(), sold_in_last)
      }
    });
  }
  if (open_house_after || open_house_before) {
    filters.push(openHouseQuery(open_house_after, open_house_before));
  }

  // TODO: make this part more DRY

  // Range queries
  if (price_min || price_max) {
    filters.push(numberRangeQuery("listPrice", price_min, price_max));
  }
  if (beds_min || beds_max) {
    filters.push(numberRangeQuery("beds", beds_min, beds_max));
  }
  if (baths_min || baths_max) {
    filters.push(numberRangeQuery("baths", baths_min, baths_max));
  }
  if (sqft_min || sqft_max) {
    filters.push(numberRangeQuery("sqft", sqft_min, sqft_max));
  }
  if (year_built_min || year_built_max) {
    filters.push(numberRangeQuery("yearBuilt", year_built_min, year_built_max));
  }
  if (lot_size_min || lot_size_max) {
    filters.push(numberRangeQuery("lotSize", lot_size_min, lot_size_max));
  }

  // Boolean queries We have to check the actual type for boolean params because if the value is false it means to
  // exclude records. A simple truthiness check wouldn't accomplish that.
  if (typeof waterfront === "boolean") {
    filters.push({ waterfront });
  }
  if (typeof view === "boolean") {
    filters.push({ view });
  }
  if (typeof fireplace === "boolean") {
    filters.push({ fireplace });
  }
  if (typeof basement === "boolean") {
    filters.push({ basement });
  }
  if (typeof garage === "boolean") {
    filters.push({ garage });
  }
  if (typeof new_construction === "boolean") {
    filters.push({ newConstruction: new_construction });
  }
  if (typeof pool === "boolean") {
    filters.push({ pool });
  }
  if (typeof air_conditioning === "boolean") {
    filters.push({ airConditioning: air_conditioning });
  }

  return filters;
};

/**
 * Convert listing search filter params into an object with MongoDB queries for each filter. Same as buildfilterQueries
 * only the query is one object rather than an array of objects.
 *
 * @example
 * buildfilterQueriesObject({ "price_min": 100000, "waterfornt": "true" })
 * // Returns { "listPrice": { $gte: 100000} }, "waterfornt": true }
 */
export const buildfilterQueriesObject = (
  queryParams: GeocodeBoundaryQueryParams
): FilterQuery<IListingModel> => {
  return buildFilterQueries(queryParams).reduce(
    (q, acc) => ({ ...acc, ...q }),
    {}
  );
};

/**
 * Create a MongoDB $sort query
 *
 * 1 == ascending, e.g., 1-10
 *
 * -1 == descending, e.g., 10-1
 *
 * @example
 * listingSortQuery({ "sort_by": "listedDate", "sort_direction": "asc" })
 * // { "listedDate": 1 }
 */
export const listingSortQuery = (
  queryParams: GeocodeBoundaryQueryParams
): FilterQuery<IListingModel> => {
  const sortBy = queryParams.sort_by || "listedDate";
  const sortDirection = queryParams.sort_direction === "asc" ? 1 : -1;
  return { [sortBy]: sortDirection };
};
