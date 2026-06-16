import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { supabase } from "@/lib/supabase";
import { generateMcqs, generateRevisionSheet, generateFlashcards } from "@/lib/models";
import { embedAndStoreChunks } from "@/lib/embeddings";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    let transcript = '';
    let fallbackTitle = '';
    let fallbackDescription = '';

    try {
      const transcriptParts = await YoutubeTranscript.fetchTranscript(videoUrl);
      transcript = transcriptParts.map((p) => p.text).join(" ");
    } catch (err) {
      console.log("Transcript not found or disabled. Falling back to video metadata.");
      // Fallback: Fetch YouTube page and extract title/description
      try {
        const ytRes = await fetch(videoUrl);
        const html = await ytRes.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch) fallbackTitle = titleMatch[1].replace(' - YouTube', '');
        
        const descMatch = html.match(/"shortDescription":"(.*?)"/);
        if (descMatch) fallbackDescription = descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        
        transcript = `[NO TRANSCRIPT AVAILABLE] Title: ${fallbackTitle}\nDescription: ${fallbackDescription}`;
      } catch (metaErr) {
        throw new Error("Could not extract transcript or video metadata.");
      }
    }

    // 2. Call Gemini 2.5 Flash using official SDK
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `You are an elite, highly-specialized AI professor designed to prepare students for highly competitive Government Exams (e.g., UPSC, SSC, State PSCs, Civil Services).
Create an exhaustively detailed, university-level study module based on the following YouTube video content. Your goal is to ensure the student can answer any difficult exam question on this topic.

CRITICAL INSTRUCTIONS:
1. **Adaptive Length**: The length and depth of your notes MUST scale proportionally with the provided content. If this is a long 1-hour lecture, write an extremely detailed, multi-page study guide breaking down every single concept thoroughly. If it's short, keep it concise but thorough. DO NOT artificially shorten long lectures.
2. **Missing Transcript**: If the text below says "[NO TRANSCRIPT AVAILABLE]", generate the best possible study module based purely on the provided video Title and Description. Elaborate on the topics mentioned in the description.
3. **Strictly English Output**: Regardless of the language spoken in the video (e.g., Hindi, Spanish), you MUST translate and generate the entire study module in STRICTLY ENGLISH. Never output notes in the source language if it is not English.
4. **Structure**: Use deep markdown formatting. Use H2 (##) for main topics, H3 (###) for sub-topics, bullet points for details, and bold text for key terminology.

Source Content:
${transcript}`;

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        break; // Success!
      } catch (err: any) {
        if (err.status === 503 && retries > 1) {
          console.log("Gemini 503 Overloaded. Retrying in 2 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          retries--;
        } else {
          throw err;
        }
      }
    }

    const notes = response?.text || "";

    // 3. Store in Supabase using the normal client
    const { data: module, error } = await supabase
      .from("study_modules")
      .insert({
        video_url: videoUrl,
        video_title: fallbackTitle || videoUrl,
        transcript,
        notes,
      })
      .select()
      .single();

    // 4. Fire off background tasks (don’t wait for them)
    const moduleId = module.id;
    
    // Embed and store chunks
    embedAndStoreChunks(moduleId, notes).catch(console.error);

    Promise.allSettled([
      generateMcqs(transcript, moduleId),
      generateRevisionSheet(transcript, moduleId),
      generateFlashcards(transcript, moduleId)
    ]).then(results => {
      console.log('Background generation completed:', results);
    });

    return NextResponse.json({
      success: true,
      module,
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
