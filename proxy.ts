import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { SearchPathname, DefaultSearchParams } from "@/config";
import { objectToQueryString } from "@/lib/listingSearchParams";
import { pathRequiresAuth } from "@/lib";

export const proxy = withAuth(
  function proxy(req) {
    // Add default params if there are none on the search page
    if (req.nextUrl.pathname === SearchPathname && req.nextUrl.search === "") {
      const url = req.nextUrl.clone();
      url.search = objectToQueryString(DefaultSearchParams);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Allow if the path doesn't require auth or if the user is logged in
      authorized: ({ token, req }) =>
        !pathRequiresAuth(req.nextUrl.pathname) || !!token
    }
  }
);

// Only applies proxy code above to routes that match. See docs:
// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/", "/account/:path*"]
};
