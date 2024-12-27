import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page.model";

export async function GET() {
    try {
        await connectToDatabase();
        const page = await Page.find({});
        if (page && page.length === 0) {
            return NextResponse.json({ message: "No Pages Found" }, { status: 404 });
        }
        return NextResponse.json({ page });
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json(
            { message: "Error fetching pages" },
            { status: 400 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Check for existing page with same URL
        const existingPage = await Page.findOne({ pageUrl: body.pageUrl });
        if (existingPage) {
            return NextResponse.json(
                { message: "A page with this URL already exists" },
                { status: 400 }
            );
        }

        const page = new Page({
            pageUrl: body.pageUrl,
            pageDescription: body.pageDescription
        });
        await page.save();
        return NextResponse.json({ page });
    } catch (error: any) {
        console.error("Error creating page:", error);
        return NextResponse.json(
            { message: error.message || "Error creating page" },
            { status: 400 }
        );
    }
}