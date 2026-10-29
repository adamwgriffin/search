import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { boundsSearchQuerySchema } from "@/zod_schemas/boundsSearchRequestSchema";
import { boundsParamsToGeoJSONPolygon } from "@/lib/listing_search_helpers";
import { getPaginationParams } from "@/lib";
import listingSearchView from "@/views/listingSearchView";

export async function GET(request: NextRequest) {
  const searchParamsObject = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  );
  const result = boundsSearchQuerySchema.safeParse(searchParamsObject);
  if (!result.success) {
    return NextResponse.json(result.error, { status: 400 });
  }
  const searchParams = result.data;
  const { bounds_north, bounds_east, bounds_south, bounds_west } = searchParams;
  const geoJSONPolygon = boundsParamsToGeoJSONPolygon({
    bounds_north,
    bounds_east,
    bounds_south,
    bounds_west
  });
  const pagination = getPaginationParams(searchParams);
  const results = await db.Listing.findWithinBounds(
    geoJSONPolygon,
    searchParams,
    pagination
  );

  return NextResponse.json(listingSearchView(results, pagination));
}
