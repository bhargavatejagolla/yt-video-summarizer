"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type Module = {
  id: string;
  created_at: string;
  video_url: string;
};

export default function Library() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    supabase
      .from("study_modules")
      .select("id, created_at, video_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setModules(data);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Study Library</h1>
      <div className="grid gap-4">
        {modules.map((mod) => (
          <Link href={`/module/${mod.id}`} key={mod.id}>
            <Card className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition">
              <p className="text-sm text-slate-400">
                {new Date(mod.created_at).toLocaleDateString()}
              </p>
              <p className="text-emerald-400 truncate">{mod.video_url}</p>
            </Card>
          </Link>
        ))}
        {modules.length === 0 && (
          <p className="text-slate-400">
            No notes yet. Generate your first one!
          </p>
        )}
      </div>
    </main>
  );
}
