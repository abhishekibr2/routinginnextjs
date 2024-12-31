import { connectToDatabase } from "@/lib/mongodb";
import { GetPages } from "../../../../../../utils/page";
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

export async function GET() {
    try {
        await connectToDatabase();
        const page = await GetPages();
        const response = NextResponse.json(
            page && page.data.length === 0
                ? { message: "No Pages Found" }
                : { page },
            { status: page && page.data.length === 0 ? 404 : 200 }
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