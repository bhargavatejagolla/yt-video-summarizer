import { supabaseAdmin } from './supabase';
import { GoogleGenAI } from '@google/genai';

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

const geminiAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function callGemini(messages: ChatMessage[]) {
  const prompt = messages.map(m => m.content).join('\n\n');
  const response = await geminiAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

async function callOpenRouter(model: string, messages: ChatMessage[], fallbackModel?: string): Promise<string> {
  try {
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
      throw new Error(`OpenRouter failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (fallbackModel) {
      console.log(`Model ${model} failed, falling back to OpenRouter ${fallbackModel}`);
      try {
        return await callOpenRouter(fallbackModel, messages);
      } catch {
        // Drop down to gemini fallback
      }
    }
    console.log(`OpenRouter completely failed for ${model}. Falling back to reliable Gemini.`);
    return callGemini(messages);
  }
}

async function callGroq(model: string, messages: ChatMessage[]): Promise<string> {
  const finalModel = USE_CUSTOM_MODEL && CUSTOM_MODEL_ID ? CUSTOM_MODEL_ID : model;
  
  try {
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
  } catch (error) {
    console.log(`Groq completely failed for ${model}. Falling back to reliable Gemini.`);
    return callGemini(messages);
  }
}

function parseJsonResponse(response: string, isArray = true) {
  try {
    return JSON.parse(response);
  } catch (e) {
    const match = response.match(/```(?:json)?\n([\s\S]*?)\n```/i);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        return isArray ? [] : null;
      }
    }
    return isArray ? [] : null;
  }
}

export async function generateMcqs(transcript: string, moduleId: string) {
  const prompt = `Based on the following content, generate 10 incredibly difficult, high-stakes multiple-choice questions (MCQs) designed specifically for competitive Government Exams (e.g., UPSC, SSC, Civil Services). Focus on nuanced, tricky concepts rather than basic facts.
For each MCQ, provide:
- question (string)
- options (array of 4 strings)
- correctIndex (0-3)
- explanation (string)
- topic (short, like "Fundamental Rights" or "Indian Geography")

CRITICAL: Regardless of the source text language, the MCQs and all fields MUST be generated in STRICTLY ENGLISH. Translate if necessary.

Output as a JSON array ONLY. Do not include markdown formatting, just the raw JSON array.
  
  Source Text:
  ${transcript}`;

  const primaryModel = USE_CUSTOM_MODEL && CUSTOM_MODEL_ID ? CUSTOM_MODEL_ID : MODELS.deepseek;

  const response = await callOpenRouter(primaryModel, [
    { role: 'system', content: 'You generate exam-style MCQs in English. Output pure JSON.' },
    { role: 'user', content: prompt }
  ], MODELS.nemotron);

  const mcqs = parseJsonResponse(response, true);

  if (mcqs && mcqs.length > 0) {
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
  }
  return mcqs;
}

export async function generateRevisionSheet(transcript: string, moduleId: string) {
  const prompt = `Based on the source text, create a rapid-fire, high-yield revision sheet specifically designed for last-minute competitive Government Exam (UPSC/SSC) preparation. Include:
  - Key points
  - One-liner facts
  - Important dates/names/definitions
  - Quick summary
  
  CRITICAL: Regardless of the source text language, the revision sheet MUST be generated in STRICTLY ENGLISH. Translate if necessary.

  Source Text:
  ${transcript}`;

  const response = await callOpenRouter(MODELS.nemotron, [
    { role: 'system', content: 'You create revision material in English.' },
    { role: 'user', content: prompt }
  ]);

  await supabaseAdmin.from('revision_sheets').insert({
    module_id: moduleId,
    content: response
  });
  return response;
}

export async function generateFlashcards(transcript: string, moduleId: string) {
  const prompt = `Based on the source text, create 15 advanced flashcards tailored for competitive Government Exam preparation (UPSC/SSC). Focus on high-probability exam topics, historical dates, complex definitions, and critical concepts. Each flashcard should have a front (question/concept) and back (answer/definition).
  
  CRITICAL: Regardless of the source text language, the flashcards MUST be generated in STRICTLY ENGLISH. Translate if necessary.
  
  Output as a JSON array ONLY of objects with fields: front, back. Do not include markdown formatting, just the raw JSON array.
  
  Source Text:
  ${transcript}`;

  const response = await callGroq(MODELS.groqLlama, [
    { role: 'system', content: 'You generate flashcards for study in English. Output pure JSON.' },
    { role: 'user', content: prompt }
  ]);

  const cards = parseJsonResponse(response, true);

  if (cards && cards.length > 0) {
    for (const card of cards) {
      await supabaseAdmin.from('flashcards').insert({
        module_id: moduleId,
        front: card.front,
        back: card.back
      });
    }
  }
  return cards;
}
