'use client';

import { useUser } from '@/lib/useUser';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WeakTopic {
  topic: string;
  incorrect: number;
  total: number;
  accuracy: number;
}

export default function Dashboard() {
  const userId = useUser();
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [dailyPlan, setDailyPlan] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!userId) return;
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    // Fetch all attempts for accuracy and streak
    const { data: allData } = await supabase
      .from('quiz_attempts')
      .select('correct, attempted_at, mcqs!inner(topic)')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false });

    if (!allData) return;

    setTotalAttempts(allData.length);
    setCorrectAttempts(allData.filter(d => d.correct).length);

    // Group by topic
    const topicTotals: Record<string, { correct: number; total: number }> = {};
    const dates = new Set<string>();

    allData.forEach((row: any) => {
      const topic = row.mcqs?.topic || 'General';
      if (!topicTotals[topic]) topicTotals[topic] = { correct: 0, total: 0 };
      topicTotals[topic].total += 1;
      if (row.correct) topicTotals[topic].correct += 1;

      // Extract date string YYYY-MM-DD
      const dateStr = new Date(row.attempted_at).toISOString().split('T')[0];
      dates.add(dateStr);
    });

    const weak: WeakTopic[] = Object.entries(topicTotals)
      .map(([topic, stats]) => ({
        topic,
        incorrect: stats.total - stats.correct,
        total: stats.total,
        accuracy: Math.round((stats.correct / stats.total) * 100),
      }))
      .filter(t => t.accuracy < 70)  // show topics below 70% accuracy
      .sort((a, b) => a.accuracy - b.accuracy);

    setWeakTopics(weak);

    // Calculate Streak
    calculateStreak(Array.from(dates));
  };

  const calculateStreak = (activeDates: string[]) => {
    if (activeDates.length === 0) {
      setStreak(0);
      return;
    }

    // Sort dates descending
    activeDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);

    // Check if they played today or yesterday to start the streak
    const lastPlayedStr = activeDates[0];
    const lastPlayedDate = new Date(lastPlayedStr);
    lastPlayedDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastPlayedDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays > 1) {
      setStreak(0);
      return;
    }

    if (diffDays === 1) {
      // They didn't play today, but played yesterday. Check backwards from yesterday.
      checkDate = lastPlayedDate;
    }

    // Traverse dates backward
    for (const dateStr of activeDates) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // Move back 1 day
      } else if (d.getTime() < checkDate.getTime()) {
        // Gap found
        break;
      }
    }

    setStreak(currentStreak);
  };

  const generatePlan = async () => {
    setPlanLoading(true);
    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weakTopics, streak }),
      });
      const data = await response.json();
      setDailyPlan(data.plan);
    } catch (err) {
      setDailyPlan('Sorry, could not generate plan right now.');
    } finally {
      setPlanLoading(false);
    }
  };

  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Your Progress Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-slate-400">Questions</p>
            <p className="text-3xl font-bold">{totalAttempts}</p>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-slate-400">Correct</p>
            <p className="text-3xl font-bold text-emerald-400">{correctAttempts}</p>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-slate-400">Accuracy</p>
            <p className={`text-3xl font-bold ${overallAccuracy >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {overallAccuracy}%
            </p>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-orange-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">🔥</div>
            <p className="text-slate-400">Current Streak</p>
            <p className="text-3xl font-bold text-orange-400">{streak} Days</p>
          </Card>
        </div>

        {/* Weak Topics */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Weak Topics (below 70%)</h2>
          {weakTopics.length === 0 ? (
            <p className="text-slate-400">Great job! No weak topics detected yet.</p>
          ) : (
            <div className="space-y-4">
              {weakTopics.map((t) => (
                <div key={t.topic} className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center">
                    <span>{t.topic}</span>
                    <span className="text-red-400 text-sm font-semibold">{t.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${t.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Daily Study Plan */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Daily Study Plan</h2>
          {dailyPlan ? (
            <div className="prose prose-invert whitespace-pre-wrap max-w-none">{dailyPlan}</div>
          ) : (
            <Button onClick={generatePlan} disabled={planLoading} className="bg-emerald-500 hover:bg-emerald-600">
              {planLoading ? 'Generating...' : 'Generate Today\'s Plan'}
            </Button>
          )}
        </Card>
      </div>
    </main>
  );
}
