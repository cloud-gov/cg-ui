// For demo purposes only

// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware

// latest info on why middleware may run multiple times: https://github.com/vercel/next.js/issues/39917

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { sessionOptions as protectedPageOptions } from "./app/protected-pages/lib";
import { cookies } from "next/headers";
import { SessionOptions, getIronSession } from "iron-session";

// Only here for the multi examples demo, in your app this would be imported from elsewhere
const sessionOptions = {
  "/protected-pages/protected-middleware":
    protectedPageOptions
};

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const session = await getIronSession(
    cookies(),
    sessionOptions[request.nextUrl.pathname],
  );

  if (!session.isLoggedIn) {
    const redirectTo = request.nextUrl.pathname.split(
      "/protected-middleware",
    )[0];

    return Response.redirect(`${request.nextUrl.origin}${redirectTo}`, 302);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path+/protected-middleware",
};
