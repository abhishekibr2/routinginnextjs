"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetPageUsingURL } from "../../../utils/page";
import BaseContainer from '@/components/layouts/BaseContainer';
import DynamicComponent from '@/components/layouts/DynamicComponent';

interface PageSchema {
    id: string;
    page_url: string;
    page_title: string;
    page_description: string;
    page_status: "draft" | "published" | "archived";
    page_metadata_title: string;
    page_metadata_description: string;
    page_content: ContentConfig[];
    created_at: number;
}

interface ContentConfig {
    type: string;
    name: string;
    config: any;
}


export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [pageDetails, setPageDetails] = useState<PageSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<ContentConfig | null>(null)
    const router = useRouter();


    useEffect(() => {
        const fetchPageDetails = async () => {
            try {
                const { slug } = await params;
                setSlug(slug);

                const response = await GetPageUsingURL(slug)
                
                // Check if page is not published
                if (response.data.page_status !== "published") {
                    throw new Error("This page is not available");
                }
                
                setPageDetails(response.data);
                setContent(response.data.page_content)
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

    // Additional check for page status (defensive programming)
    if (pageDetails?.page_status !== "published") {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-2xl text-red-500">This page is not available</div>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {pageDetails?.page_content.map((content, index) => {
                const containerTypes = [
                    'container-1-1',
                    'container-1-2',
                    'container-1-3',
                    'container-2-3',
                    'container-1-4',
                    'container-3-1',
                    'container-1-4-4',
                    'container-3-4'
                ];

                if (containerTypes.includes(content.type)) {
                    return <BaseContainer key={`${content.config.id}-${index}`} config={content.config} />;
                }

                // For non-container components
                return <DynamicComponent key={`${content.config.id}-${index}`} {...content} />;
            })}
        </div>
    );
}