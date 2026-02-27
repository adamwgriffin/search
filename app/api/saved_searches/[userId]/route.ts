import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export type SavedSearchesParams = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(_request: Request, { params }: SavedSearchesParams) {
  const savedSearch = await prisma.savedSearch.findMany({
    where: {
      userId: (await params).userId
    }
  });
  return NextResponse.json(savedSearch);
}
