'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Answer {
  selected_index: number;
  correct: boolean;
  mcqs: {
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
    topic: string;
  };
}

export default function ResultPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [testInfo, setTestInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: test } = await supabase.from('mock_tests').select('*').eq('id', testId).single();
      setTestInfo(test);
      setScore(test?.score || 0);
      setTotal(test?.total_questions || 0);

      const { data: ans } = await supabase
        .from('mock_test_answers')
        .select(`
          selected_index,
          correct,
          mcqs (question, options, correct_index, explanation, topic)
        `)
        .eq('test_id', testId);
      setAnswers(ans || []);
    })();
  }, [testId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mock Test Results</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-slate-600 bg-slate-800/50 hover:bg-slate-700">
              Dashboard
            </Button>
            <Button onClick={() => router.push('/mock-test/configure')} className="bg-emerald-500 hover:bg-emerald-600">
              Take Another
            </Button>
          </div>
        </div>
        
        <Card className="p-8 bg-slate-800/80 border-slate-700 text-center shadow-xl">
          <p className="text-7xl font-black text-emerald-400 mb-4">{score} <span className="text-3xl text-slate-500">/ {total}</span></p>
          <div className="flex justify-center gap-8 text-slate-300">
            <p className="text-lg">Accuracy: <span className="text-white font-bold">{total > 0 ? Math.round((score/total)*100) : 0}%</span></p>
            {testInfo && (
              <>
                <p className="text-lg">Limit: <span className="text-white font-bold">{testInfo.time_limit_minutes} min</span></p>
                <p className="text-lg">Date: <span className="text-white font-bold">{new Date(testInfo.completed_at || testInfo.created_at).toLocaleDateString()}</span></p>
              </>
            )}
          </div>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-6">Detailed Analysis</h2>
        <div className="space-y-6">
          {answers.map((a, idx) => {
            const q = a.mcqs;
            return (
              <Card key={idx} className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full uppercase tracking-wider">{q.topic}</span>
                  {a.correct ? (
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded font-bold text-sm">Correct</span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded font-bold text-sm">Incorrect</span>
                  )}
                </div>
                
                <p className="font-semibold text-lg mb-6">{idx + 1}. {q.question}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt: string, i: number) => {
                    let style = 'bg-slate-700/50 text-slate-300 border border-slate-600';
                    if (i === q.correct_index) {
                      style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium'; // Correct answer
                    } else if (i === a.selected_index && !a.correct) {
                      style = 'bg-red-500/20 border-red-500 text-red-300'; // User picked wrong
                    }
                    
                    return (
                      <div key={i} className={`p-4 rounded-lg flex items-start gap-3 ${style}`}>
                        <span className="font-bold opacity-50">{String.fromCharCode(65 + i)}.</span>
                        <span>{opt} {i === a.selected_index && ' (Your answer)'}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 uppercase font-bold mb-1 tracking-wider">Explanation</p>
                  <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
