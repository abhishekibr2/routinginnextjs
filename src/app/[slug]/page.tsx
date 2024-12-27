"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageDetails {
    pageUrl: string;
    pageDescription: string;
    createdAt: string;
}

export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPageDetails = async () => {
            try {
                const { slug } = await params;
                setSlug(slug);

                const response = await fetch(`/api/page/get-page-data`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ slug }),
                    }
                );
                if (!response.ok) {
                    throw new Error('Page not found');
                }

                const data = await response.json();
                setPageDetails(data.page);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to load page');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageDetails();
    }, [params]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-2xl text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-2xl text-red-500">{error}</div>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">
                        {pageDetails?.pageUrl}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-lg text-center text-muted-foreground">
                        {pageDetails?.pageDescription}
                    </div>
                    <div className="text-sm text-gray-400 text-center">Created At: {pageDetails?.createdAt}</div>
                    <div className="flex justify-center">
                        <Button onClick={() => window.close()}>
                            Close this page.
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}