import type { Polygon, MultiPolygon } from "@turf/turf";
import type { ListingAddress } from "../zod_schemas/listingSchema";
import type { IBoundary } from "../models/BoundaryModel";
import type { GeocodeBoundaryQueryParams } from "../zod_schemas/geocodeBoundarySearchSchema";
import type { BoundsParams } from "../zod_schemas/listingSearchParamsSchema";
import type { BoundarySearchQueryParams } from "../zod_schemas/boundarySearchRequestSchema";
import { bboxPolygon, intersect } from "@turf/turf";
import { differenceInDays } from "date-fns";
import {
  addressComponentsToListingAddress,
  getPlaceDetails,
  isListingAddressType
} from "./geocoder";
import {
  AddressComponent,
  AddressType,
  GeocodeResult
} from "@googlemaps/google-maps-services-js";
import Listing from "../models/ListingModel";
import { ListingDetailResultWithSelectedFields } from "../types/listing_search_response_types";
import { ListingDetailResultProjectionFields } from "../config";
import Boundary from "../models/BoundaryModel";
import { getPaginationParams } from ".";
import listingSearchBoundaryView from "../views/listingSearchBoundaryView";
import listingSearchGeocodeNoBoundaryView from "../views/listingSearchGeocodeNoBoundaryView";
import { listingAddressSchema } from "../zod_schemas/listingSchema";

export const daysOnMarket = (
  listedDate: Date,
  soldDate: Date | undefined
): number => {
  return differenceInDays(soldDate || new Date(), listedDate);
};

/**
 * Converts a set of north/east/south/west coordinates into a rectangular
 * polygon
 */
export const boundsParamsToGeoJSONPolygon = (bounds: BoundsParams): Polygon => {
  const { bounds_north, bounds_east, bounds_south, bounds_west } = bounds;
  return bboxPolygon([bounds_west, bounds_south, bounds_east, bounds_north])
    .geometry;
};

/**
 * Remove any parts of a boundary that are outside of a set of bounds. These
 * bounds typically represent the viewport of a map. The purpose of doing this
 * is to adjust a geospatial boundary in order to avoid returning listings that
 * are outside the map viewport. If intersect returns null that means the
 * boundary is outside the viewport, which case we can return null as a signal
 * to avoid trying to search.
 */
export const removePartsOfBoundaryOutsideOfBounds = (
  bounds: BoundsParams,
  boundary: Polygon | MultiPolygon
) => {
  const boundsPolygon = boundsParamsToGeoJSONPolygon(bounds);
  return intersect(boundsPolygon, boundary)?.geometry || null;
};

/**
 * If bounds params are present, modify the boundary so that any parts that are
 * outside of the bounds will be removed. This way the search will only return
 * results that are within both the boundary + the bounds.
 */
export const getBoundaryGeometryWithBounds = (
  boundary: IBoundary,
  queryParams: BoundarySearchQueryParams
) => {
  const { bounds_north, bounds_east, bounds_south, bounds_west } = queryParams;
  if (bounds_north && bounds_east && bounds_south && bounds_west) {
    const bounds = { bounds_north, bounds_east, bounds_south, bounds_west };
    return removePartsOfBoundaryOutsideOfBounds(bounds, boundary.geometry);
  } else {
    return boundary.geometry;
  }
};

export const listingAddressHasRequiredFields = (
  listingAddress: ListingAddress
) => listingAddressSchema.safeParse(listingAddress).success;

export const getListingForAddressSearch = async (
  address_components: AddressComponent[],
  place_id: string
) => {
  const listingAddress = addressComponentsToListingAddress(address_components);
  if (listingAddressHasRequiredFields(listingAddress)) {
    return Listing.findByPlaceIdOrAddress(place_id, listingAddress);
  } else {
    return Listing.findOne<ListingDetailResultWithSelectedFields>(
      { placeId: place_id },
      ListingDetailResultProjectionFields
    );
  }
};

export const getAddressTypesFromParams = (address_types: string) =>
  address_types.split(",") as AddressType[];

export const getResponseForPlaceId = async (
  queryParams: GeocodeBoundaryQueryParams
) => {
  const { place_id, address_types } = queryParams;
  if (!place_id || !address_types) return;
  // If it's an address we will need to geocode so we can't just use place_id.
  // Logic in the controller handles that for the sake of effeciency
  if (isListingAddressType(getAddressTypesFromParams(address_types))) return;

  const pagination = getPaginationParams(queryParams);
  const boundary = await Boundary.findOne({ placeId: place_id });
  if (!boundary) {
    const { geometry } = (await getPlaceDetails({ place_id })).data.result;
    if (!geometry) return;
    return listingSearchGeocodeNoBoundaryView(geometry.viewport);
  }
  const results = await Listing.findWithinBounds(
    boundary.geometry,
    queryParams,
    pagination
  );
  return listingSearchBoundaryView(boundary, results, pagination);
};

export const getResponseForListingAddress = async ({
  address_components,
  place_id,
  geometry
}: GeocodeResult) => {
  const listing = await getListingForAddressSearch(
    address_components,
    place_id
  );
  return listingSearchGeocodeNoBoundaryView(geometry.viewport, listing);
};

export const getResponseForBoundary = async (
  { place_id, geometry }: GeocodeResult,
  queryParams: GeocodeBoundaryQueryParams
) => {
  const pagination = getPaginationParams(queryParams);
  const boundary = await Boundary.findOne({ placeId: place_id });
  if (!boundary) {
    return listingSearchGeocodeNoBoundaryView(geometry.viewport);
  }
  const results = await Listing.findWithinBounds(
    boundary.geometry,
    queryParams,
    pagination
  );
  return listingSearchBoundaryView(boundary, results, pagination);
};

export const getListingDetail = async (slug: string) => {
  const listing = await Listing.findOne(
    { slug },
    ListingDetailResultProjectionFields
  ).lean();
  if (!listing) return null;
  const currentOpenHouses =
    listing.openHouses?.filter((openHouse) => {
      return openHouse.start > new Date();
    }) || [];
  return {
    ...listing,
    openHouses: currentOpenHouses,
    daysOnMarket: daysOnMarket(listing.listedDate, listing.soldDate)
  };
};
