import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ListingResultProjectionFields } from "@/config";

export type ListingIdsParams = {
  params: Promise<{
    listing_ids: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: ListingIdsParams) {
  const ids = (await params).listing_ids.split(",");
  const listings = await db.Listing.find(
    { _id: { $in: ids } },
    ListingResultProjectionFields
  );
  return NextResponse.json({ listings });
}
