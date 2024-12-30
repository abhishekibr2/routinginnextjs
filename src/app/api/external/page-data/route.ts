import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page.model";
import { NextResponse } from "next/server";

// Add OPTIONS handler
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || "",
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
        },
    });
}


export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        if (!body.EXTERNAL_API_SECRET) {
            const response = NextResponse.json(
                { message: "Unauthorised." },
                { status: 401 }
            );
            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', '*');
            return response;
        }
        if (body.EXTERNAL_API_SECRET !== process.env.EXTERNAL_API_SECRET) {
            const response = NextResponse.json(
                { message: "Unauthorised." },
                { status: 401 }
            );
            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', '*');
            return response;
        }

        const page = await Page.findById(body.pageId);
        if (!page) {
            const response = NextResponse.json(
                { message: "A page with this URL not found." },
                { status: 400 }
            );
            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', '*');
            return response;
        }

        const response = NextResponse.json(
            { message: "Page fetched Successfully.", status: 200, page: page }
        );
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');
        return response;
    } catch (error: any) {
        console.error("Error creating page:", error);
        const response = NextResponse.json(
            { message: error.message || "Error creating page" },
            { status: 400 }
        );
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');
        return response;
    }
}