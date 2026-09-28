import type { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth_options";
import prisma from "../../../lib/prismadb";

// The findUnique method returns a subset of the entire User type
export type UserQueryResult = Pick<
  User,
  "id" | "name" | "email" | "image" | "image" | "favoriteIds"
> | null;

// There's currently a bug in the type definitions for GET that causes a
// Typescript error when we build the project. Explicitly typing the return
// value for the function allows us to work around this.
export async function GET(): Promise<NextResponse<UserQueryResult>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(null);
  }
  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      favoriteIds: true
    }
  });
  return NextResponse.json(currentUser);
}
