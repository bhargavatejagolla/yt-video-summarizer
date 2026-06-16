'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { McqQuiz } from '@/components/McqQuiz';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function ModulePage() {
  const { id } = useParams<{ id: string }>();

  // Fetch notes (from study_modules)
  const { data: module, isLoading: notesLoading } = useQuery({
    queryKey: ['module', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('study_modules')
        .select('notes, video_title')
        .eq('id', id)
        .single();
      return data;
    }
  });

  // Fetch MCQs
  const { data: mcqs = [] } = useQuery({
    queryKey: ['mcqs', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mcqs')
        .select('*')
        .eq('module_id', id);
      return data || [];
    }
  });

  // Fetch flashcards
  const { data: flashcards = [] } = useQuery({
    queryKey: ['flashcards', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('flashcards')
        .select('*')
        .eq('module_id', id);
      return data || [];
    }
  });

  // Fetch revision sheet
  const { data: revision } = useQuery({
    queryKey: ['revision', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('revision_sheets')
        .select('content')
        .eq('module_id', id)
        .single();
      return data?.content || '';
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-300">
      {/* Background ambient mesh glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 line-clamp-1">
            {module?.video_title || "Study Module"}
          </h1>
        </div>
      </header>

      <Tabs defaultValue="notes" className="flex-1 flex flex-col md:flex-row relative z-10 max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-[280px] lg:w-[320px] border-r border-white/5 bg-slate-900/30 p-4 md:p-6 shrink-0 md:min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Module Content</p>
            <TabsList className="flex md:flex-col bg-transparent w-full h-auto p-0 space-y-0 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto justify-start">
              <TabsTrigger 
                value="notes" 
                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-none text-slate-400 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3 font-medium">
                  <span className="text-lg">📝</span> Detailed Notes
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="mcqs" 
                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-none text-slate-400 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between w-full font-medium">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎯</span> Practice MCQs
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 py-0.5 px-2 rounded-full text-xs">{mcqs.length}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="flashcards" 
                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-none text-slate-400 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between w-full font-medium">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎴</span> Flashcards
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 py-0.5 px-2 rounded-full text-xs">{flashcards.length}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="revision" 
                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-none text-slate-400 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3 font-medium">
                  <span className="text-lg">⚡</span> Rapid Revision
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <Card className="p-6 md:p-10 bg-slate-900/60 backdrop-blur-xl border-white/5 shadow-2xl rounded-3xl min-h-[70vh]">
            <TabsContent value="notes" className="mt-0 focus-visible:outline-none">
              {notesLoading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.4 }}
                  className="prose prose-invert prose-emerald max-w-none prose-headings:font-extrabold prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-p:leading-relaxed prose-li:leading-relaxed"
                >
                  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(module?.notes || '') }} />
                  <div className="mt-16 pt-8 border-t border-white/10">
                    <FeedbackWidget
                      contentType="notes"
                      contentId={id}
                      originalContent={module?.notes}
                      metadata={{ source: 'youtube' }}
                    />
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="mcqs" className="mt-0 focus-visible:outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <McqQuiz mcqs={mcqs} />
              </motion.div>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-0 focus-visible:outline-none">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 xl:grid-cols-2 gap-6"
              >
                {flashcards.map((card: any) => (
                  <motion.div 
                    variants={itemVariants}
                    key={card.id} 
                    className="group relative h-64 perspective-1000"
                  >
                    <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180 cursor-pointer">
                      {/* Front */}
                      <div className="absolute w-full h-full backface-hidden bg-slate-800/80 border border-slate-700 rounded-3xl p-8 flex items-center justify-center text-center shadow-lg hover:border-emerald-500/50 transition-colors">
                        <p className="text-xl font-bold text-white leading-relaxed">{card.front}</p>
                      </div>
                      {/* Back */}
                      <div className="absolute w-full h-full backface-hidden bg-emerald-900/90 border border-emerald-500/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                        <p className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">Answer</p>
                        <p className="text-lg text-emerald-50 leading-relaxed overflow-y-auto no-scrollbar">{card.back}</p>
                        <div className="absolute bottom-4 right-4">
                          <FeedbackWidget
                            contentType="flashcard"
                            contentId={card.id}
                            originalContent={`Q: ${card.front}\nA: ${card.back}`}
                            metadata={{ }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {flashcards.length === 0 && (
                  <div className="col-span-full py-32 text-center text-slate-500 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-6"></div>
                    <p className="text-lg">Crafting intelligent flashcards...</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="revision" className="mt-0 focus-visible:outline-none">
              {revision ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold"
                >
                  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(revision) }} />
                  <div className="mt-16 pt-8 border-t border-white/10">
                    <FeedbackWidget
                      contentType="revision"
                      contentId={id}
                      originalContent={revision}
                      metadata={{ }}
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="py-32 text-center text-slate-500 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-6"></div>
                  <p className="text-lg">Compiling rapid revision sheet...</p>
                </div>
              )}
            </TabsContent>
          </Card>
        </main>
      </Tabs>
    </div>
  );
}

function markdownToHtml(md: string): string {
  if (!md) return '';
  return md
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2 text-white">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl font-extrabold mt-8 mb-4 border-b border-slate-700 pb-2 text-emerald-400">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
    .replace(/- (.*)/g, '<li class="ml-6 list-disc mb-1 text-slate-300">$1</li>')
    .replace(/\n/g, '<br/>');
}
