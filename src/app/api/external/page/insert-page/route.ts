import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { InsertPage } from "../../../../../../utils/page";

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

        const page = await InsertPage(body.pageData)
        console.log(page)
        const response = NextResponse.json(
            { message: "Page added Successfully.", status: 200, page: page }
        );
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || "");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');
        return response;
    } catch (error: any) {
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