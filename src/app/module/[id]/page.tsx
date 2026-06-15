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
        .select('notes')
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
    <main className="min-h-screen bg-background relative overflow-hidden text-foreground pb-20">
      {/* Background ambient mesh glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {module?.video_title || "Study Module"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Master this topic with AI-generated notes, interactive flashcards, and exam-style MCQs.
          </p>
        </motion.div>

        <Card className="p-1 sm:p-2 bg-card/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/5">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto flex-nowrap rounded-xl no-scrollbar border-b border-white/5 mb-2">
              <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
                Notes
              </TabsTrigger>
              <TabsTrigger value="mcqs" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
                MCQs <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{mcqs.length}</span>
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
                Flashcards <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{flashcards.length}</span>
              </TabsTrigger>
              <TabsTrigger value="revision" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">
                Revision
              </TabsTrigger>
            </TabsList>

            <div className="p-4 sm:p-6 md:p-8">
              <TabsContent value="notes" className="mt-0 focus-visible:outline-none">
                {notesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.4 }}
                    className="prose prose-invert prose-primary max-w-none prose-headings:font-bold prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-white"
                  >
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(module?.notes || '') }} />
                    <div className="mt-12 pt-6 border-t border-white/10">
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {flashcards.map((card: any) => (
                    <motion.div 
                      variants={itemVariants}
                      key={card.id} 
                      className="group relative p-6 bg-card/60 backdrop-blur-md border border-white/5 rounded-2xl hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <p className="font-bold text-lg mb-4 text-foreground relative z-10">{card.front}</p>
                      <p className="text-muted-foreground relative z-10 leading-relaxed mb-6">{card.back}</p>
                      <div className="relative z-10 pt-4 border-t border-white/5 flex justify-end">
                        <FeedbackWidget
                          contentType="flashcard"
                          contentId={card.id}
                          originalContent={`Q: ${card.front}\nA: ${card.back}`}
                          metadata={{ }}
                        />
                      </div>
                    </motion.div>
                  ))}
                  {flashcards.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p>Crafting intelligent flashcards...</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="revision" className="mt-0 focus-visible:outline-none">
                {revision ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="prose prose-invert prose-primary max-w-none prose-headings:font-bold"
                  >
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(revision) }} />
                    <div className="mt-12 pt-6 border-t border-white/10">
                      <FeedbackWidget
                        contentType="revision"
                        contentId={id}
                        originalContent={revision}
                        metadata={{ }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>Compiling rapid revision sheet...</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}

function markdownToHtml(md: string): string {
  if (!md) return '';
  return md
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-slate-600 pb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>');
}
