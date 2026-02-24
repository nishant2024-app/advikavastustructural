import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js proxy for protecting admin routes.
 * Checks for auth session cookies and redirects to login if not authenticated.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const hasSession = checkAuthCookies(request);

        if (!hasSession) {
            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect /admin/login if already authenticated
    if (pathname === "/admin/login") {
        const hasSession = checkAuthCookies(request);

        if (hasSession) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return NextResponse.next();
}

function checkAuthCookies(request: NextRequest): boolean {
    // NextAuth v5 uses "authjs.session-token" (or __Secure- prefix in production)
    const cookieNames = [
        "authjs.session-token",
        "__Secure-authjs.session-token",
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
    ];

    return cookieNames.some((name) => request.cookies.get(name)?.value);
}

export const config = {
    matcher: ["/admin/:path*"],
};
