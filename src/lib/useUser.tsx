'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Brain, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const UserContext = createContext<string>('');

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let stored = localStorage.getItem('study_user_id');
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem('study_user_id', stored);
    }
    setUserId(stored);

    const loggedIn = localStorage.getItem('study_auth_logged_in_v2');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'pravalikhagolla' && password === 'Anjibunny@123') {
      localStorage.setItem('study_auth_logged_in_v2', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
        {/* Left Side - Hero / Feature Section */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden bg-slate-900 border-r border-white/5 flex-col items-start justify-center p-12 lg:p-24">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Brain className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">StudyAI Platform</h2>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400 leading-tight mb-8">
              Master your highly competitive exams.
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-12">
              Transform massive YouTube lectures into elite, exhaustive, multi-page study guides engineered specifically for UPSC, SSC, and state civil services.
            </p>

            <div className="space-y-6">
              {[
                { icon: Sparkles, text: "Adaptive, Deeply Nuanced Notes" },
                { icon: Target, text: "High-Stakes, Tricky MCQs" },
                { icon: BookOpen, text: "Rapid Revision Sheets & Flashcards" }
              ].map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-4 text-slate-300"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-medium text-lg">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <Card className="p-8 sm:p-10 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
              
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                  <Lock className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-center">Authenticate to access your secure workspace.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 h-14 px-5 rounded-xl focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 h-14 px-5 rounded-xl focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                    {error}
                  </motion.p>
                )}

                <Button type="submit" className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all mt-6">
                  Sign In
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
