import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, topics, difficulty, count, timeLimitMinutes } = await request.json();

    // Build query using Admin client to bypass RLS
    let query = supabaseAdmin.from('mcqs').select('id');

    if (topics && topics.length > 0) {
      query = query.in('topic', topics);
    }
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty);
    }

    // Get random subset
    const { data: allMatching } = await query;
    if (!allMatching || allMatching.length < count) {
      return NextResponse.json({ error: `Only ${allMatching?.length || 0} MCQs available for these criteria. Need ${count}.` }, { status: 400 });
    }

    // Shuffle and pick 'count' questions
    const shuffled = allMatching.sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, count).map((m: any) => m.id);

    // Create test session using Admin client
    const { data: test, error } = await supabaseAdmin
      .from('mock_tests')
      .insert({
        user_id: userId,
        total_questions: count,
        time_limit_minutes: timeLimitMinutes,
        total_possible: count,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ testId: test.id, mcqIds: selectedIds });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
