import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mongooseConnect from "../../../../../../lib/mongooseConnect";
import Listing from "../../../../../../models/ListingModel";
import Boundary from "../../../../../../models/BoundaryModel";
import { getPaginationParams } from "../../../../../../lib";
import { getBoundaryGeometryWithBounds } from "../../../../../../lib/listing_search_helpers";
import listingSearchBoundaryView from "../../../../../../views/listingSearchBoundaryView";
import {
  type BoundarySearchParams,
  boundarySearchRequestSchema
} from "../../../../../../zod_schemas/boundarySearchRequestSchema";

export type BoundaryRequstParams = {
  params: Promise<BoundarySearchParams>;
};

export async function GET(
  request: NextRequest,
  { params }: BoundaryRequstParams
) {
  await mongooseConnect();

  const searchParamsObject = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  );
  const result = boundarySearchRequestSchema.safeParse({
    query: searchParamsObject,
    params: await params
  });
  if (!result.success) {
    console.error(result.error);
    return NextResponse.json("Type error encounted when parsing request", {
      status: 400
    });
  }
  const {
    query,
    params: { id }
  } = result.data;

  const boundary = await Boundary.findById(id);
  if (!boundary) {
    return NextResponse.json(
      { message: `No boundary found for boundary id ${id}.` },
      { status: 404 }
    );
  }
  const pagination = getPaginationParams(query);
  const bounds = getBoundaryGeometryWithBounds(boundary, query);
  // Map viewport bounds were included but the boundary was moved outside the
  // viewport, so there's nothing to search.
  if (bounds === null) {
    return NextResponse.json(
      listingSearchBoundaryView(boundary, null, pagination)
    );
  }
  const results = await Listing.findWithinBounds(bounds, query, pagination);
  return NextResponse.json(
    listingSearchBoundaryView(boundary, results, pagination)
  );
}
