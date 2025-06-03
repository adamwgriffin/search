import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export interface SavedSearchesParams {
  userId: string;
}

export async function GET(
  _request: Request,
  { params }: { params: SavedSearchesParams }
) {
  const savedSearch = await prisma.savedSearch.findMany({
    where: {
      userId: params.userId
    }
  });
  return NextResponse.json(savedSearch);
}
