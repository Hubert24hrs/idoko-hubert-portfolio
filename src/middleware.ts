import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect admin routes.
 * Redirects unauthenticated users to /admin/login.
 */
export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!isLoggedIn) {
            const loginUrl = new URL("/admin/login", req.nextUrl.origin);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If logged in and on login page, redirect to dashboard
    if (pathname === "/admin/login" && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};
