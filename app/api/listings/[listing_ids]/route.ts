import { type NextRequest, NextResponse } from "next/server";
import mongooseConnect from "../../../../lib/mongooseConnect";
import Listing from "../../../../models/ListingModel";
import { ListingResultProjectionFields } from "../../../../config";

export type ListingIdsParams = {
  params: {
    listing_ids: string;
  };
};

export async function GET(_request: NextRequest, { params }: ListingIdsParams) {
  await mongooseConnect();

  const ids = params.listing_ids.split(",");
  const listings = await Listing.find(
    { _id: { $in: ids } },
    ListingResultProjectionFields
  );
  return NextResponse.json({ listings });
}
