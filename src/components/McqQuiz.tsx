'use client';

import { useState } from 'react';
import { useUser } from '@/lib/useUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FeedbackWidget } from '@/components/FeedbackWidget';

interface Mcq {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  topic?: string;
}

export function McqQuiz({ mcqs }: { mcqs: Mcq[] }) {
  const userId = useUser();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = async (optIndex: number) => {
    if (showResult) return;
    const correct = optIndex === mcqs[current].correct_index;
    setSelected(optIndex);
    setShowResult(true);
    if (correct) setScore(s => s + 1);

    // Record attempt
    if (userId) {
      await fetch('/api/quiz/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          mcqId: mcqs[current].id,
          selectedIndex: optIndex,
          correct,
        }),
      }).catch(console.error);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowResult(false);
    setCurrent(prev => Math.min(prev + 1, mcqs.length - 1));
  };

  if (mcqs.length === 0) return <p className="text-slate-400">No MCQs yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      {/* Progress bar */}
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / mcqs.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-primary h-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
        />
      </div>

      <motion.div
        key={current} // This forces re-render/animation on question change
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border border-white/5 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Question {current + 1} of {mcqs.length}
            </span>
            {mcqs[current].topic && (
              <span className="text-xs font-semibold text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {mcqs[current].topic}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-8 text-foreground leading-snug">
            {mcqs[current].question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mcqs[current].options?.map((opt, i) => {
              let bgClass = 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary/50 text-foreground';
              if (showResult) {
                if (i === mcqs[current].correct_index) bgClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                else if (i === selected && i !== mcqs[current].correct_index) bgClass = 'bg-destructive/20 border-destructive/50 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                else bgClass = 'bg-white/5 opacity-40 border-white/5 text-muted-foreground';
              }
              return (
                <motion.button
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left font-medium ${bgClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-muted-foreground font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                {selected === mcqs[current].correct_index ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">✗</div>
                )}
                <p className={`text-lg font-bold ${selected === mcqs[current].correct_index ? 'text-emerald-400' : 'text-destructive'}`}>
                  {selected === mcqs[current].correct_index ? 'Excellent! That is correct.' : 'Incorrect. Let\'s review.'}
                </p>
              </div>
              
              <p className="text-base text-muted-foreground leading-relaxed pl-11">{mcqs[current].explanation}</p>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1">
                  <FeedbackWidget
                    contentType="mcq"
                    contentId={mcqs[current].id}
                    originalContent={mcqs[current].question + '\n' + mcqs[current].options.map((o, i) => `${i === mcqs[current].correct_index ? '[CORRECT] ' : ''}${o}`).join('\n') + '\nExplanation: ' + mcqs[current].explanation}
                    metadata={{ topic: mcqs[current].topic }}
                  />
                </div>
                <Button onClick={nextQuestion} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                  {current < mcqs.length - 1 ? 'Next Question →' : 'View Results'}
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {current === mcqs.length - 1 && showResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 mt-8 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-sm"
        >
          <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Completed!</h2>
          <p className="text-xl text-primary">You scored <span className="text-white font-bold">{score}</span> out of {mcqs.length}</p>
        </motion.div>
      )}
    </div>
  );
}
