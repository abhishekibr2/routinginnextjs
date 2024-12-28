import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page.model";


export async function GET() {
    try {
        await connectToDatabase();
        const page = await Page.find({});
        const response = NextResponse.json(
            page && page.length === 0
                ? { message: "No Pages Found" }
                : { page },
            { status: page && page.length === 0 ? 404 : 200 }
        );

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');

        return response;
    } catch (error) {
        console.error("Error fetching pages:", error);
        const response = NextResponse.json(
            { message: "Error fetching pages" },
            { status: 400 }
        );

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');

        return response;
    }
}

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

        const existingPage = await Page.findOne({ pageUrl: body.pageUrl });
        if (existingPage) {
            const response = NextResponse.json(
                { message: "A page with this URL already exists" },
                { status: 400 }
            );
            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', '*');
            return response;
        }

        const page = new Page({
            pageUrl: body.pageUrl,
            pageDescription: body.pageDescription
        });
        await page.save();
        const response = NextResponse.json(
            { message: "Page Created Successfully.", status: 200, page: page }
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