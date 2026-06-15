import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { supabase } from "@/lib/supabase";
import { generateMcqs, generateRevisionSheet, generateFlashcards } from "@/lib/models";
import { embedAndStoreChunks } from "@/lib/embeddings";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    // 1. Extract transcript
    const transcriptParts = await YoutubeTranscript.fetchTranscript(videoUrl);
    const transcript = transcriptParts.map((p) => p.text).join(" ");

    // 2. Call Gemini 2.5 Flash using official SDK
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `You are an expert study assistant.
Create a comprehensive, well-structured study module based on the following lecture transcript.

CRITICAL INSTRUCTION: The length and depth of your notes MUST scale proportionally with the length of the transcript. If this is a long 1-hour lecture, write an extremely detailed, multi-page study guide that leaves no concept out. If it is a short 5-minute video, keep it concise but thorough. DO NOT artificially shorten long lectures.

Use markdown format with headers (##, ###), bullet points, and bold text for key terms.
Transcript:
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
        video_title: videoUrl, // you can later fetch actual title
        transcript,
        notes,
      })
      .select()
      .single();

    if (error) throw new Error("Supabase insert failed: " + error.message);

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
