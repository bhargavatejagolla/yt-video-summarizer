import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, weakTopics, streak } = await request.json();
    
    // Get user's last 20 quiz attempts for context
    const { data: recent } = await supabase
      .from('quiz_attempts')
      .select('mcqs(topic), correct, attempted_at')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false })
      .limit(20);

    const weakList = weakTopics.map((t: any) => `${t.topic} (${t.accuracy}% accuracy)`).join(', ');
    
    const prompt = `You are an expert study planner for competitive exams. 
The student has a current study streak of ${streak} days!
The student has these weak topics: ${weakList || 'none yet'}.
Based on this, suggest a **daily study plan** for today. 
The plan should include:
- What topics to review first (weak ones)
- How many MCQs to practice per topic
- Suggested revision time
- Tips for improvement

Keep it concise, motivational, and actionable. Use plain text, but well-structured.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a strict but supportive study coach.' },
          { role: 'user', content: prompt },
        ],
      }),
    });
    const data = await response.json();
    const plan = data.choices[0].message.content;

    // Optionally save the plan
    await supabase.from('study_plans').insert({
      user_id: userId,
      plan_text: plan,
    });

    return NextResponse.json({ plan });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
