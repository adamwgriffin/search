import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type SavedSearchParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: SavedSearchParams) {
  const savedSearch = await prisma.savedSearch.findUnique({
    where: {
      id: (await params).id
    }
  });
  return savedSearch
    ? NextResponse.json(savedSearch)
    : new NextResponse(null, { status: 404 });
}

export async function PUT(request: Request, { params }: SavedSearchParams) {
  try {
    const savedSearch = await prisma.savedSearch.update({
      where: {
        id: (await params).id
      },
      data: await request.json()
    });
    return NextResponse.json(savedSearch);
  } catch (error) {
    console.error("Error updating saved search:", error);
    return NextResponse.json(
      { error: "Error updating saved search" },
      { status: 422 }
    );
  }
}

export async function DELETE(_request: Request, { params }: SavedSearchParams) {
  try {
    await prisma.savedSearch.delete({
      where: {
        id: (await params).id
      }
    });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error deleting saved search:", error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Saved search not found" },
        { status: 404 }
      );
    }
  }
}
