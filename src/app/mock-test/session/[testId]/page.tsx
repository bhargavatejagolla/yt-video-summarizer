'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';

interface Mcq {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  topic?: string;
}

export default function TestSession() {
  const { testId } = useParams<{ testId: string }>();
  const userId = useUser();
  const router = useRouter();

  const [questions, setQuestions] = useState<Mcq[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch test details and questions
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/mock-test/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    })();
  }, [testId]);

  // Fetch time limit
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('mock_tests')
        .select('time_limit_minutes')
        .eq('id', testId)
        .single();
      if (data) setTimeLeft(data.time_limit_minutes * 60);
    })();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, finished]);

  // Auto-submit if time runs out
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && !finished) {
      handleFinish();
    }
  }, [timeLeft, finished, questions]);

  const handleAnswer = (optIndex: number) => {
    setSelected(optIndex);
  };

  const handleNext = async () => {
    if (selected === null) return;
    const correct = selected === questions[current].correct_index;
    // Submit answer
    await fetch('/api/mock-test/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId, mcqId: questions[current].id, selectedIndex: selected, correct }),
    });
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (finished) return;
    setFinished(true);
    // Complete test
    await fetch('/api/mock-test/complete', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ testId }) 
    });
    router.push(`/mock-test/result/${testId}`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) return <div className="text-white p-8 min-h-screen bg-slate-900 flex items-center justify-center">Loading Test Environment...</div>;

  const q = questions[current];

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 shadow-md z-10">
        <span className="font-semibold">Question {current + 1} / {questions.length}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Time left:</span>
          <span className="text-red-400 font-mono text-2xl font-bold bg-slate-900 px-3 py-1 rounded">{formatTime(timeLeft)}</span>
        </div>
        <Button variant="outline" onClick={handleFinish} className="text-red-400 border-red-400 hover:bg-red-400/10">Submit Early</Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300" 
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-3xl">
          <Card className="p-8 bg-slate-800/80 border-slate-700 shadow-xl">
            {q.topic && <span className="inline-block px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full mb-4 uppercase tracking-wider">{q.topic}</span>}
            <p className="text-xl font-semibold mb-8 leading-relaxed text-white">{q.question}</p>

            <div className="grid grid-cols-1 gap-4">
              {q.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selected === i 
                      ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-400 text-slate-200'
                  }`}
                >
                  <span className="inline-block w-8 font-bold text-slate-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <Button 
              onClick={handleNext} 
              disabled={selected === null} 
              className="mt-8 w-full h-12 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
            >
              {current === questions.length - 1 ? 'Finish & Submit' : 'Save & Next'}
            </Button>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
