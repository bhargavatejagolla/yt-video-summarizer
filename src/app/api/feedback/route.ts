import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, contentType, contentId, rating, originalContent, editedContent, metadata } = await request.json();

    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      content_type: contentType,
      content_id: contentId,
      rating,
      original_content: originalContent,
      edited_content: editedContent,
      metadata: metadata || {},
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
