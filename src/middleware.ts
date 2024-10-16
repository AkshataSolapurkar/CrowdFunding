// src/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    // Define paths
    const loginPath = '/login';
    const signupPath = '/signup';
    const mainPath = '/'; // The main page

    // If the user is not authenticated
    if (!token) {
        // Allow access to login and signup pages
        if (req.nextUrl.pathname === loginPath || req.nextUrl.pathname === signupPath) {
            return NextResponse.next();
        }
        
        // Redirect unauthenticated users to the login page if accessing other routes
        return NextResponse.redirect(new URL(loginPath, req.url));
    } else {
        // User is authenticated
        if (req.nextUrl.pathname === loginPath || req.nextUrl.pathname === signupPath) {
            // Redirect authenticated users to the main page
            return NextResponse.redirect(new URL(mainPath, req.url));
        }
    }

    // Allow access to the requested page if none of the above conditions are met
    return NextResponse.next();
}

// Specify the paths to apply the middleware
export const config = {
    matcher: [
        '/login',
        '/signup',
        '/',
    ],
};
