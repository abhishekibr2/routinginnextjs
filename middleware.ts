// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || "",
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "")
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', '*')

    return response
}

export const config = {
    matcher: '/api/:path*'  // Changed to match /api routes
}