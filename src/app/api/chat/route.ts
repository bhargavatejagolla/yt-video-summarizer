import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getEmbedding } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    // 1. Embed the user's question
    const questionEmbedding = await getEmbedding(question);

    // 2. Search for most relevant chunks using pgvector
    const { data: chunks, error } = await supabase.rpc('match_chunks', {
      query_embedding: questionEmbedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) {
      console.error("Match chunks error:", error);
    }

    const context = chunks?.map((c: any) => c.chunk).join('\n\n') || '';

    // 3. Build prompt for Groq
    const systemPrompt = `You are an expert study assistant. Answer the user's question using ONLY the context below. If the context doesn't contain the answer, say you don't know.
Context:
${context}`;

    // 4. Stream response from Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        stream: true,
      }),
    });

    // 5. Pipe the stream back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body?.getReader();
        if (!reader) return controller.close();

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          // Groq's stream format: "data: {...}\n\n". We forward as-is (SSE).
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
