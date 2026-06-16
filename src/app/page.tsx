"use client";

import { useState, useEffect } from "react";
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
  const [loadingText, setLoadingText] = useState("Extracting video metadata...");

  const loadingStates = [
    "Extracting video metadata...",
    "Analyzing visual and audio context...",
    "Structuring comprehensive study guide...",
    "Finalizing notes and formatting...",
  ];

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      let step = 0;
      interval = setInterval(() => {
        step = (step + 1) % loadingStates.length;
        setLoadingText(loadingStates[step]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const handleGenerate = () => {
    if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
      mutate(url);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 flex justify-end p-6 gap-4">
        <Link href="/mock-test/configure">
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 bg-slate-900/40 backdrop-blur-md transition-all">
            Mock Tests
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 bg-slate-900/40 backdrop-blur-md transition-all">
            Dashboard
          </Button>
        </Link>
        <Link href="/library">
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 bg-slate-900/40 backdrop-blur-md transition-all">
            Library
          </Button>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-emerald-200 to-blue-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            StudyAI
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
            Transform any YouTube video into an interactive, detailed study module instantly.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <Card className="p-2 bg-slate-900/60 border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste YouTube Link (https://youtube.com/watch?v=...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 text-lg px-6 h-14 focus-visible:ring-0"
              />
              <Button
                onClick={handleGenerate}
                disabled={isPending || !url}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 h-14 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                {isPending ? "Processing..." : "Generate Module"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isPending && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-12 w-full max-w-2xl text-center"
            >
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-emerald-300"
                  >
                    {loadingText}
                  </motion.p>
                  <p className="text-sm text-slate-500">For long videos, this can take up to 60 seconds.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 max-w-2xl w-full text-center backdrop-blur-md"
            >
              <p className="font-semibold text-lg">Whoops!</p>
              <p>{error.message || "Something went wrong. Check your link or try again."}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}

// Simple Markdown-to-HTML
function markdownToHtml(md: string): string {
  return md
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2 text-white">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl font-extrabold mt-8 mb-4 border-b border-slate-700 pb-2 text-emerald-400">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
    .replace(/- (.*)/g, '<li class="ml-6 list-disc mb-1 text-slate-300">$1</li>')
    .replace(/\n/g, "<br/>");
}
