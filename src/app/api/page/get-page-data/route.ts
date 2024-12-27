// app/api/page/[slug]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page.model";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const page = await Page.findOne({ pageUrl: body.slug });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { message: "Error fetching page" },
      { status: 404 }
    );
  }
}
