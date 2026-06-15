import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, mcqId, selectedIndex, correct } = await request.json();
    const { error } = await supabase.from('quiz_attempts').insert({
      user_id: userId,
      mcq_id: mcqId,
      selected_index: selectedIndex,
      correct,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
