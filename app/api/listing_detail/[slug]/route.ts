import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mongooseConnect from "../../../../lib/mongooseConnect";
import { getListingDetail } from "../../../../lib/listing_search_helpers";

export type ListingDetailParams = {
  slug: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: ListingDetailParams }
) {
  await mongooseConnect();

  const listing = await getListingDetail(params.slug);
  if (!listing) {
    return NextResponse.json(
      { message: `Listing not found with slug ${params.slug}` },
      { status: 404 }
    );
  }

  return NextResponse.json(listing);
}
