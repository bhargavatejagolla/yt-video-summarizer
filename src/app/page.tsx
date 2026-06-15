"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async (videoUrl: string) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      if (!res.ok) throw new Error("Generation failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.module?.id) {
        router.push(`/module/${data.module.id}`);
      }
    }
  });

  const handleGenerate = () => {
    if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
      mutate(url);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="flex justify-end p-4 gap-4">
        <Link href="/mock-test/configure">
          <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700 bg-slate-800/50">
            Mock Tests
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700 bg-slate-800/50">
            Dashboard
          </Button>
        </Link>
        <Link href="/library">
          <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700 bg-slate-800/50">
            Library
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            StudyAI
          </h1>
          <p className="text-lg text-slate-300 mt-3">
            Paste a YouTube lecture, get instant study notes
          </p>
        </motion.div>

        {/* Input Card */}
        <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6"
            >
              {isPending ? "Generating..." : "Generate Notes"}
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {isPending && (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-5/6 bg-slate-700" />
            <Skeleton className="h-4 w-2/3 bg-slate-700" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
          >
            {error.message ||
              "Something went wrong. Check your link or try again."}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data?.module?.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm prose prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(data.module.notes),
                  }}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// Simple Markdown-to-HTML (we'll use a proper library in next phases)
function markdownToHtml(md: string): string {
  return md
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(
      /## (.*)/g,
      '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-slate-600 pb-2">$1</h2>',
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, "<br/>");
}
