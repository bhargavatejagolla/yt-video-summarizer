import { supabaseAdmin } from './supabase';

export async function embedAndStoreChunks(moduleId: string, notes: string) {
  // 1. Split notes into chunks (simple split by double newline)
  const rawChunks = notes.split(/\n\n+/).filter(c => c.trim().length > 50);
  
  for (const chunk of rawChunks) {
    // 2. Get embedding from Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: chunk }]
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to embed chunk:', await response.text());
      continue;
    }

    const data = await response.json();
    const embedding = data.embedding.values;

    // 3. Store in Supabase using Admin client
    await supabaseAdmin.from('note_chunks').insert({
      module_id: moduleId,
      chunk,
      embedding,
    });
  }
}

export async function getEmbedding(text: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: {
          parts: [{ text }]
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get embedding for question');
  }

  const data = await response.json();
  return data.embedding.values;
}
