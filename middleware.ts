// Without a defined matcher, this one line applies next-auth to the entire project
export { default } from "next-auth/middleware";

// Will need to keep this in sync with matcher below. They reprent the same thing but have to be different data types
// because of the apis that consume them
export const AuthPaths = [/^\/account.*/];

// Applies next-auth only to matching routes - can be regex
// Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/account/:path*"]
};
