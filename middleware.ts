import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
    const isOnLogin = req.nextUrl.pathname === '/admin/login'
    const isOnApi = req.nextUrl.pathname.startsWith('/api')

    // Allow API routes to handle their own auth
    if (isOnApi) {
        return NextResponse.next()
    }

    // If on admin pages (except login) and not logged in, redirect to login
    if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        const loginUrl = new URL('/admin/login', req.nextUrl.origin)
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If on login page and already logged in, redirect to admin
    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
