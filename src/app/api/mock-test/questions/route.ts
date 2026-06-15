import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { ids } = await request.json();
  const { data } = await supabase.from('mcqs').select('*').in('id', ids);
  return NextResponse.json({ questions: data || [] });
}
