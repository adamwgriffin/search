import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { isValidObjectId } from "mongoose";
import authOptions from "@/lib/auth_options";
import db from "@/lib/db";

export type FavoritesParams = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function POST(_request: Request, { params }: FavoritesParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const { listingId } = await params;

  if (!isValidObjectId(listingId)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const { matchedCount } = await db.User.updateOne(
    { _id: session.user.id },
    { $addToSet: { favoriteIds: listingId } }
  );

  if (matchedCount === 0) {
    return NextResponse.json(
      { error: "Current user not found" },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 200 });
}

export async function DELETE(_request: Request, { params }: FavoritesParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await params;

  if (!isValidObjectId(listingId)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const { matchedCount } = await db.User.updateOne(
    { _id: session.user.id },
    { $pull: { favoriteIds: listingId } }
  );

  if (matchedCount === 0) {
    return NextResponse.json(
      { error: "Current user not found" },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 200 });
}
