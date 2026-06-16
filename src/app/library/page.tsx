'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, PlayCircle } from 'lucide-react';

export default function LibraryPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      const { data, error } = await supabase
        .from('study_modules')
        .select('id, video_title, created_at, video_url')
        .order('created_at', { ascending: false });
        
      if (data) setModules(data);
      setLoading(false);
    }
    fetchModules();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Background ambient mesh glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl px-8 py-6 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Your Library</h1>
            <p className="text-slate-400 text-sm">Past explanations and generated study modules.</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
            Generate New Module
          </Button>
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-6"></div>
            <p className="text-lg text-slate-400">Loading your library...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No modules found</h2>
            <p className="text-slate-400 max-w-md mb-8">
              You haven't generated any study modules yet. Paste a YouTube link on the home page to get started.
            </p>
            <Link href="/">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8">
                Generate Your First Module
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/module/${mod.id}`}>
                  <Card className="h-full flex flex-col p-6 bg-slate-900/60 backdrop-blur-md border-white/5 shadow-xl hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-all duration-300 group cursor-pointer rounded-2xl">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-slate-800 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                          <PlayCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {mod.video_title || "Untitled Module"}
                      </h3>
                      
                      <div className="flex items-center text-xs text-slate-500 gap-2 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(mod.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">View Module</span>
                      <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
