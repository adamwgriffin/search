import type { GeocodeBoundaryQueryParams } from "../../../../../zod_schemas/geocodeBoundarySearchSchema";
import { type NextRequest, NextResponse } from "next/server";
import mongooseConnect from "../../../../../lib/mongooseConnect";
import {
  getResponseForBoundary,
  getResponseForListingAddress,
  getResponseForPlaceId
} from "../../../../../lib/listing_search_helpers";
import {
  geocode,
  getGeocodeParamsFromQuery,
  isListingAddressType
} from "../../../../../lib/geocoder";
import { geocodeBoundaryQuerySchema } from "../../../../../zod_schemas/geocodeBoundarySearchSchema";

export async function GET(request: NextRequest) {
  await mongooseConnect();

  const searchParamsObject: GeocodeBoundaryQueryParams = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  );
  const result = geocodeBoundaryQuerySchema.safeParse(searchParamsObject);
  if (!result.success) {
    return NextResponse.json(result.error, { status: 400 });
  }
  const searchParams = result.data;

  const placeIdRes = await getResponseForPlaceId(searchParams);
  if (placeIdRes) {
    return NextResponse.json(placeIdRes);
  }

  const { place_id, address } = searchParams;
  const geocodeResult = (
    await geocode(getGeocodeParamsFromQuery({ place_id, address }))
  ).data.results[0];

  if (isListingAddressType(geocodeResult.types)) {
    return NextResponse.json(await getResponseForListingAddress(geocodeResult));
  }

  return NextResponse.json(
    await getResponseForBoundary(geocodeResult, searchParams)
  );
}
