import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import db from "@/lib/db";

export type SavedSearchParams = {
  params: Promise<{
    id: string;
  }>;
};

const notFound = () =>
  NextResponse.json({ error: "Saved search not found" }, { status: 404 });

export async function GET(_request: Request, { params }: SavedSearchParams) {
  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  const savedSearch = await db.SavedSearch.findById(id);
  return savedSearch ? NextResponse.json(savedSearch) : notFound();
}

export async function PUT(request: Request, { params }: SavedSearchParams) {
  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    const savedSearch = await db.SavedSearch.findByIdAndUpdate(
      id,
      await request.json(),
      { returnDocument: "after", runValidators: true }
    );
    return savedSearch ? NextResponse.json(savedSearch) : notFound();
  } catch (error) {
    console.error("Error updating saved search:", error);
    return NextResponse.json(
      { error: "Error updating saved search" },
      { status: 422 }
    );
  }
}

export async function DELETE(_request: Request, { params }: SavedSearchParams) {
  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  const savedSearch = await db.SavedSearch.findByIdAndDelete(id);
  return savedSearch ? new NextResponse(null, { status: 200 }) : notFound();
}
