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
    <main className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
        >
          Performance Dashboard
        </motion.h1>

        {/* Stats cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-6"
        >
          <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <p className="text-slate-400 font-medium mb-2">Questions Answered</p>
            <p className="text-4xl font-bold text-white">{totalAttempts}</p>
          </Card>
          <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <p className="text-slate-400 font-medium mb-2">Correct Answers</p>
            <p className="text-4xl font-bold text-emerald-400">{correctAttempts}</p>
          </Card>
          <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <p className="text-slate-400 font-medium mb-2">Overall Accuracy</p>
            <p className={`text-4xl font-bold ${overallAccuracy >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {overallAccuracy}%
            </p>
          </Card>
          <Card className="p-6 bg-orange-500/10 border-orange-500/20 backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-7xl opacity-10">🔥</div>
            <p className="text-orange-200/70 font-medium mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-orange-400 drop-shadow-md">{streak} Days</p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weak Topics */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-lg h-full">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-sm">🎯</span>
                Target Areas
              </h2>
              {weakTopics.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                  <p>Great job! No weak topics detected yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {weakTopics.map((t) => (
                    <div key={t.topic} className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-300">{t.topic}</span>
                        <span className="text-red-400 text-sm font-bold bg-red-500/10 px-2 py-0.5 rounded">{t.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${t.accuracy}%` }} 
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Daily Study Plan */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-lg h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">📅</span>
                Daily AI Study Plan
              </h2>
              {dailyPlan ? (
                <div className="prose prose-invert whitespace-pre-wrap max-w-none text-slate-300 flex-1 leading-relaxed bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                  {dailyPlan}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-950/30">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-xs">Generate a personalized study plan based on your recent weak topics and progress.</p>
                  <Button 
                    onClick={generatePlan} 
                    disabled={planLoading} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    {planLoading ? 'Analyzing Data...' : 'Generate Today\'s Plan'}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
