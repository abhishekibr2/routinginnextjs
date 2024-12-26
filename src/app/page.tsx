"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  return (
    <div className="text-center text-5xl h-screen flex items-center justify-center">
      <input
        type="text"
        className="border"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        variant={"default"}
        className="ml-2 px-4 h-10 w-20 text-sm"
        onClick={() => {
          router.push(url);
        }}
      >
        Open
      </Button>
    </div>
  );
}
