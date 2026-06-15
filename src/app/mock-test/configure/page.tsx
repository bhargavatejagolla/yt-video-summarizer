'use client';

import { useState } from 'react';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function ConfigureTest() {
  const userId = useUser();
  const router = useRouter();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('all');
  const [count, setCount] = useState(25);
  const [timeLimit, setTimeLimit] = useState(30); // minutes

  // Fetch all unique topics from MCQs
  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data } = await supabase.from('mcqs').select('topic');
      return [...new Set(data?.map((d: any) => d.topic).filter(Boolean))];
    }
  });

  const toggleTopic = (t: string) => {
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleStart = async () => {
    const res = await fetch('/api/mock-test/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        topics: selectedTopics,
        difficulty,
        count,
        timeLimitMinutes: timeLimit,
      }),
    });
    const data = await res.json();
    if (data.testId) {
      router.push(`/mock-test/session/${data.testId}`);
    } else {
      alert(data.error || 'Failed to create test');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <Card className="max-w-lg mx-auto p-6 bg-slate-800/50 border-slate-700 text-white">
        <h1 className="text-2xl font-bold mb-6">Configure Mock Test</h1>
        
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Topics (leave empty for all)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((t: string) => (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedTopics.includes(t) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 text-slate-300 hover:border-slate-300'}`}
                >
                  {t}
                </button>
              ))}
              {topics.length === 0 && <p className="text-slate-500 text-sm">No topics available yet.</p>}
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Number of Questions</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={5}
              max={100}
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-300">Time Limit (minutes)</Label>
            <Input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min={5}
              max={180}
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <Button onClick={handleStart} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
            Start Test
          </Button>
        </div>
      </Card>
    </main>
  );
}
