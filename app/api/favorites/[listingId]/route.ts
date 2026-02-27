import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth_options";
import prisma from "../../../../lib/prismadb";

export type FavoritesParams = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function POST(
  _request: Request,
  { params }: FavoritesParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      favoriteIds: true
    }
  });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Current user not found" },
      { status: 404 }
    );
  }

  const favoriteIds = Array.from(
    new Set([...currentUser.favoriteIds, listingId])
  );

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      favoriteIds
    }
  });

  return new NextResponse(null, { status: 200 });
}

export async function DELETE(
  _request: Request,
  { params }: FavoritesParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      favoriteIds: true
    }
  });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Current user not found" },
      { status: 404 }
    );
  }

  const favoriteIds = (currentUser.favoriteIds || []).filter(
    (id) => id !== listingId
  );

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      favoriteIds
    }
  });

  return new NextResponse(null, { status: 200 });
}
