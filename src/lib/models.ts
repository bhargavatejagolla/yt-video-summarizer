import { supabaseAdmin } from './supabase';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

// Primary models (free / cheap)
const MODELS = {
  deepseek: 'deepseek/deepseek-r1:free',  // or 'deepseek/deepseek-chat' if R1 not free
  nemotron: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
  owl: 'owl-alpha:free',
  groqLlama: 'llama-3.1-70b-versatile', // on Groq
};

// Phase 7 Custom Model Integration
const CUSTOM_MODEL_ID = process.env.CUSTOM_MODEL_ID; // e.g., "groq-ft-llama-3.1-8b-xxxxxxxx"
const USE_CUSTOM_MODEL = process.env.USE_CUSTOM_MODEL === 'true';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenRouter(model: string, messages: ChatMessage[], fallbackModel?: string) {
  const res = await fetch(OPENROUTER_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'StudyAI',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    if (fallbackModel) {
      console.log(`Model ${model} failed, falling back to ${fallbackModel}`);
      return callOpenRouter(fallbackModel, messages);
    }
    throw new Error(`OpenRouter call failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGroq(model: string, messages: ChatMessage[]) {
  const finalModel = USE_CUSTOM_MODEL && CUSTOM_MODEL_ID ? CUSTOM_MODEL_ID : model;
  
  const res = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: finalModel, messages }),
  });

  if (!res.ok) throw new Error(`Groq call failed: ${res.statusText}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function generateMcqs(transcript: string, moduleId: string) {
  const prompt = `Based on the following transcript, generate 10 multiple-choice questions (MCQs) for government exam preparation.
For each MCQ, provide:
- question (string)
- options (array of 4 strings)
- correctIndex (0-3)
- explanation (string)
- topic (short, like "Fundamental Rights" or "Indian Geography")

Output as a JSON array.
  
  Transcript:
  ${transcript}`;

  // Use custom model if available on OpenRouter (if you uploaded it there), otherwise fallback to deepseek
  const primaryModel = USE_CUSTOM_MODEL && CUSTOM_MODEL_ID ? CUSTOM_MODEL_ID : MODELS.deepseek;

  const response = await callOpenRouter(primaryModel, [
    { role: 'system', content: 'You generate exam-style MCQs.' },
    { role: 'user', content: prompt }
  ], MODELS.nemotron); // fallback to nemotron if primary fails

  // Parse the JSON response
  let mcqs;
  try {
    mcqs = JSON.parse(response);
  } catch (e) {
    // if not valid JSON, try to extract from code blocks
    const match = response.match(/```json\n([\s\S]*?)\n```/);
    mcqs = match ? JSON.parse(match[1]) : [];
  }

  // Insert into Supabase
  for (const mcq of mcqs) {
    await supabaseAdmin.from('mcqs').insert({
      module_id: moduleId,
      question: mcq.question,
      options: mcq.options,
      correct_index: mcq.correctIndex,
      explanation: mcq.explanation,
      topic: mcq.topic
    });
  }
  return mcqs;
}

export async function generateRevisionSheet(transcript: string, moduleId: string) {
  const prompt = `Based on the transcript, create a concise revision sheet with:
  - Key points
  - One-liner facts
  - Important dates/names/definitions
  - Quick summary
  
  Transcript:
  ${transcript}`;

  const response = await callOpenRouter(MODELS.nemotron, [
    { role: 'system', content: 'You create revision material.' },
    { role: 'user', content: prompt }
  ]);

  await supabaseAdmin.from('revision_sheets').insert({
    module_id: moduleId,
    content: response
  });
  return response;
}

export async function generateFlashcards(transcript: string, moduleId: string) {
  const prompt = `Based on the transcript, create 15 flashcards. Each flashcard should have a front (question/concept) and back (answer/definition).
  Output as a JSON array of objects with fields: front, back.
  
  Transcript:
  ${transcript}`;

  const response = await callGroq(MODELS.groqLlama, [
    { role: 'system', content: 'You generate flashcards for study.' },
    { role: 'user', content: prompt }
  ]);

  let cards;
  try {
    cards = JSON.parse(response);
  } catch {
    const match = response.match(/```json\n([\s\S]*?)\n```/);
    cards = match ? JSON.parse(match[1]) : [];
  }

  for (const card of cards) {
    await supabaseAdmin.from('flashcards').insert({
      module_id: moduleId,
      front: card.front,
      back: card.back
    });
  }
  return cards;
}
