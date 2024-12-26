"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const [slug, setSlug] = useState("");
    const router = useRouter()
    useEffect(() => {
        const fetchSlug = async () => {
            const { slug } = await params;
            setSlug(slug);
        }
        fetchSlug()
    }, [])

    return (
        <div className="text-center text-5xl h-screen flex items-center justify-center">
            <div>
                This is {slug} page.
            </div>
            <div>
                <Button onClick={() => {
                    router.back();
                }}>
                    Go Back
                </Button>
            </div>
        </div>
    )
}