import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export const proxy = async function(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/sign-up");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/learn") || request.nextUrl.pathname.startsWith("/profile");

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(session ? "/learn" : "/sign-up", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
