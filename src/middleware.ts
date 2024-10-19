// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const loginPath = '/login';
    const signupPath = '/signup';
    const mainPath = '/'; // Main page for authenticated users

    if (!token) {
        // Allow access to login and signup pages
        if (req.nextUrl.pathname === loginPath || req.nextUrl.pathname === signupPath) {
            return NextResponse.next();
        }

        // Redirect unauthenticated users to the login page if accessing other routes
        return NextResponse.redirect(new URL(loginPath, req.url));
    } else {
        // User is authenticated, redirect to main page if accessing login/signup
        if (req.nextUrl.pathname === loginPath || req.nextUrl.pathname === signupPath) {
            return NextResponse.redirect(new URL(mainPath, req.url));
        }
    }

    // Allow access to the requested page if authenticated
    return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
    matcher: ['/login', '/signup', '/'],
};
