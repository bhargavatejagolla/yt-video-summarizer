import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { testId } = await request.json();

  // Count correct answers
  const { count } = await supabase
    .from('mock_test_answers')
    .select('*', { count: 'exact', head: true })
    .eq('test_id', testId)
    .eq('correct', true);

  await supabase
    .from('mock_tests')
    .update({
      completed_at: new Date().toISOString(),
      score: count || 0,
    })
    .eq('id', testId);

  return NextResponse.json({ success: true });
}
