# YouTube Study Assistant 🎓✨

Transform any YouTube lecture into a comprehensive, interactive study module in seconds. Built with Next.js, Supabase, and powered by Gemini 2.0 Flash.

![UI Preview](https://via.placeholder.com/1200x600.png?text=Premium+Study+Assistant+UI)

## 🌟 Features

- **Instant Video Processing:** Paste a YouTube URL and the system automatically extracts the transcript using `youtube-transcript`.
- **AI-Powered Summarization:** Leverages the blazing-fast `Gemini 2.0 Flash` to generate deeply structured, heavily detailed study notes scaled perfectly to the video's length.
- **Auto-Generated Flashcards:** The AI extracts key concepts and definitions to create an interactive flashcard deck for active recall.
- **Exam-Style MCQs:** Tests your knowledge with dynamically generated multiple-choice questions complete with instant feedback and detailed explanations.
- **Rapid Revision Sheets:** A condensed, bullet-pointed summary sheet for last-minute exam prep.
- **Premium Glassmorphic UI:** A stunning deep space and emerald green aesthetic built with Tailwind CSS, `@tailwindcss/typography`, and Framer Motion.
- **Supabase Integration:** Full database architecture with Row Level Security (RLS) support for user data persistence.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v3
- **Animations & UI:** Framer Motion, shadcn/ui, Lucide Icons
- **Backend & DB:** Supabase (PostgreSQL)
- **AI Models:** Google GenAI SDK (`gemini-2.5-flash`), OpenRouter, Groq

## 🛠️ Getting Started

### Prerequisites

You will need the following API keys and services:
- A [Supabase](https://supabase.com/) project.
- A [Google Gemini](https://aistudio.google.com/) API Key.

### 1. Clone the repository

```bash
git clone https://github.com/bhargavatejagolla/yt-video-summarizer.git
cd yt-video-summarizer/study-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your keys:

```env
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# REQUIRED FOR BACKGROUND TASKS (Bypasses RLS for server-side generation)
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
```

### 4. Database Schema Setup

You will need the following tables in your Supabase project:
- `study_modules`
- `mcqs`
- `flashcards`
- `revision_sheets`
- `note_chunks`
- `mock_tests`

Make sure to enable **Row Level Security (RLS)** and create appropriate policies for anonymous or authenticated users, depending on your authentication strategy. 

*Alternatively, the backend `supabaseAdmin` client uses the Service Role Key to safely bypass RLS during the background generation phases.*

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Paste a YouTube link and watch the magic happen!

---

## 🏗️ Architecture

1. **Input:** User submits a YouTube URL.
2. **Extraction:** Server fetches the transcript.
3. **Primary Generation:** Gemini generates the main study notes and saves them to `study_modules`.
4. **Background Processing:** The server immediately returns the notes to the user while asynchronously running tasks to generate MCQs, Flashcards, Embeddings, and Revision Sheets.
5. **Interactive UI:** The user navigates the beautiful Tabs layout to study, take quizzes, and flip flashcards with micro-animations.
