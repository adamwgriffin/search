// Without a defined matcher, this one line applies next-auth to the entire project
export { default as proxy } from "next-auth/middleware";

// Applies next-auth only to matching routes - can be regex
// Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/account/:path*"]
};
