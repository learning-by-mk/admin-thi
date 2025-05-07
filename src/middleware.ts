import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(req: NextRequest) {
    // Rewrite API URL
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/api')) {
        const url = req.nextUrl.clone();
        const apiUrl = process.env.API_URL || 'http://api';
        const destination = new URL(apiUrl);
        url.host = destination.host;
        url.port = destination.port;
        url.protocol = destination.protocol;
        url.pathname = pathname;
        console.log('url', url);

        return NextResponse.rewrite(url);
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/', '/:path*', '/api/:path*'],
};

export default middleware;
