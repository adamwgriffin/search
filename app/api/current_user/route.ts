import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { IUser } from "../../../models/UserModel";
import authOptions from "../../../lib/auth_options";
import db from "../../../lib/db";

// The subset of the User fields selected below, as serialized to JSON
export type CurrentUser = Pick<IUser, "name" | "email" | "image"> & {
  id: string;
  favoriteIds: string[];
};

// There's currently a bug in the type definitions for GET that causes a
// Typescript error when we build the project. Explicitly typing the return
// value for the function allows us to work around this.
export async function GET(): Promise<NextResponse<CurrentUser | null>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(null);
  }
  const currentUser = await db.User.findById(
    session.user.id,
    "name email image favoriteIds"
  );
  if (!currentUser) {
    return NextResponse.json(null);
  }
  return NextResponse.json({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image,
    favoriteIds: currentUser.favoriteIds.map((id) => id.toString())
  });
}
