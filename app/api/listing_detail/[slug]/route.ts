import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mongooseConnect from "../../../../lib/mongooseConnect";
import { getListingDetail } from "../../../../lib/listing_search_helpers";

export type ListingDetailParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: ListingDetailParams
) {
  await mongooseConnect();
  const requestParams = await params;

  const listing = await getListingDetail(requestParams.slug);
  if (!listing) {
    return NextResponse.json(
      { message: `Listing not found with slug ${requestParams.slug}` },
      { status: 404 }
    );
  }

  return NextResponse.json(listing);
}
