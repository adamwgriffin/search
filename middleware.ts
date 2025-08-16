import { AuthPathRegex } from "@/config";
import { DefaultParams } from "@/lib/listingSearchParams";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { SearchPathname } from "@/config";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === SearchPathname && req.nextUrl.search === "") {
      const url = req.nextUrl.clone();
      url.search = `?${DefaultParams}`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (AuthPathRegex.test(req.nextUrl.pathname)) {
          return !!token;
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.svg).*)"]
};
