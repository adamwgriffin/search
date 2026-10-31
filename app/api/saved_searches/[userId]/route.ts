import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import db from "@/lib/db";

export type SavedSearchesParams = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(_request: Request, { params }: SavedSearchesParams) {
  const { userId } = await params;
  if (!isValidObjectId(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const savedSearch = await db.SavedSearch.find({ userId });
  return NextResponse.json(savedSearch);
}
