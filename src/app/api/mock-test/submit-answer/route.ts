import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { testId, mcqId, selectedIndex, correct } = await request.json();

    await supabase.from('mock_test_answers').insert({
      test_id: testId,
      mcq_id: mcqId,
      selected_index: selectedIndex,
      correct,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
