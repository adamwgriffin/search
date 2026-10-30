import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(request: Request) {
  const res = await db.SavedSearch.create(await request.json());
  return NextResponse.json(res, { status: 201 });
}
