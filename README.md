# 🎓 YouTube Study Assistant - Premium Learning Platform

<div align="center">

```
   ╔═══════════════════════════════════════════════════════════╗
   ║                                                           ║
   ║     🎓 YOUTUBE STUDY ASSISTANT - PREMIUM EDITION 🎓     ║
   ║                                                           ║
   ║   Transform Any Lecture into Interactive Study Materials ║
   ║        Powered by Gemini 2.0 Flash × Next.js 16         ║
   ║                                                           ║
   ╚═══════════════════════════════════════════════════════════╝
```

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-EA4335?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Transform educational content. Master complex topics. Ace your exams.**

[🚀 Get Started](#-quick-start) • [📖 Full Guide](#-installation--setup) • [💬 Support](#-support) • [⭐ Star Us](#-show-your-support)

</div>

---

## ✨ What's Inside

```
┌─────────────────────────────────────────────────────────────┐
│                   ONE CLICK MAGIC ✨                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📺 Paste YouTube URL                                      │
│     ↓                                                       │
│  📝 AI Generates Study Notes (Gemini 2.0 Flash)           │
│     ↓                                                       │
│  🎯 Auto-Create Flashcards, MCQs, & Revision Sheets       │
│     ↓                                                       │
│  ✅ Get Interactive Study Module Instantly                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Killer Features

### 📺 **YouTube Transcript Extraction**
```
✅ One-click video processing
✅ Automatic caption detection
✅ Timestamp-based segmentation
✅ Supports 150+ languages
✅ Real-time transcript display
```

### 🧠 **AI-Powered Content Generation**
```
✅ Gemini 2.0 Flash processing (BLAZING FAST ⚡)
✅ Duration-aware summarization
✅ Auto-structured notes with hierarchy
✅ Key concepts highlighting
✅ Concept relationship mapping
```

### 📚 **Complete Study Suite**

| Feature | Description | Time to Generate |
|---------|-------------|------------------|
| **📝 Study Notes** | Comprehensive, well-structured notes | Instant |
| **🎯 Flashcards** | Interactive Q&A pairs for memorization | 15-30 sec |
| **❓ MCQ Quiz** | Exam-style multiple choice with explanations | 20-45 sec |
| **⚡ Quick Review** | Bullet-pointed condensed summary | 10-20 sec |
| **📊 Progress Stats** | Track learning journey with analytics | Real-time |

### 🎨 **Premium Glassmorphic UI**

**Design System:**
```
Color Palette:
  ┌─ Primary:   #10B981 (Emerald Green)
  ├─ Dark:      #0F172A (Deep Navy)
  ├─ Accent:    #F59E0B (Golden)
  └─ Text:      #E5E7EB (Light Gray)

Typography:
  ┌─ Headers:   Geist (Bold, 2.5rem - 3.5rem)
  ├─ Body:      Geist (Regular, 1rem)
  └─ Code:      JetBrains Mono (0.875rem)

Spacing Grid: 8px (px-1, px-2, px-4, px-8, px-16...)
```

### 🎬 **Butter-Smooth Animations**

```javascript
✨ FADE-IN ENTRANCE
   • Trigger: Page load
   • Duration: 300ms ease-out
   • Opacity: 0 → 1
   • Demo: Study notes fade in smoothly

🔄 CARD STAGGER CASCADE
   • Trigger: Tab switch
   • Delay: 100ms between cards
   • Effect: Cascade down from top
   • Creates visual hierarchy & excitement

🃏 FLASHCARD 3D FLIP
   • Trigger: Click/tap card
   • Duration: 600ms cubic-bezier
   • Effect: Y-axis 3D rotation
   • Physics: Spring tension (0.8)

🎯 BUTTON MICRO-INTERACTIONS
   • Hover: Scale 1.05 + glow effect
   • Click: Scale 0.95 (press effect)
   • Active: Color shift to emerald
   • Duration: 150ms smooth

✅ CORRECT ANSWER GLOW
   • Effect: Emerald green pulse
   • Duration: 500ms × 2 cycles
   • Opacity: 0.5 → 1 → 0.5
   • Creates celebration feedback

❌ ERROR SHAKE
   • Effect: Horizontal vibration
   • Duration: 300ms
   • Movement: -5px ↔ +5px
   • Frequency: 4 shakes total

📱 PARALLAX SCROLLING
   • Layers: 3-5 depth levels
   • Offset: 30-50% of scroll speed
   • Creates immersive depth effect
   • Smooth 60fps performance
```

**Implemented with:** Framer Motion, Tailwind CSS transforms, CSS keyframes

---

## 🚀 Quick Start

### ⚡ **60-Second Setup**

```bash
# 1️⃣ Clone repository
git clone https://github.com/bhargavatejagolla/yt-video-summarizer.git
cd study-assistant

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create .env.local with your API keys (see below)

# 4️⃣ Start development server
npm run dev

# 5️⃣ Open http://localhost:3000 in browser
# 🎉 Start creating study materials!
```

### 🔑 **Get Your API Keys** (5 minutes)

**Google Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create new API key
4. Copy & paste to `.env.local`

**Supabase Database:**
1. Sign up at [supabase.com](https://supabase.com/)
2. Create new project (free tier works!)
3. Copy URL and Anon Key from Settings
4. Add to `.env.local`

**That's it!** ✨

---

## 📖 Installation & Setup

### 📋 Prerequisites

```bash
# Check Node.js version (need v18+)
node --version

# Check npm version
npm --version
```

**What You Need:**
- ✅ Node.js 18.0 or higher
- ✅ npm/yarn/pnpm
- ✅ Git installed
- ✅ Google Gemini API Key (FREE)
- ✅ Supabase Account (FREE tier works!)

### Step 1️⃣: Clone Repository

```bash
# Using HTTPS (recommended)
git clone https://github.com/bhargavatejagolla/yt-video-summarizer.git

# Navigate to project
cd yt-video-summarizer/study-assistant

# List files to verify
ls -la
```

### Step 2️⃣: Install All Dependencies

```bash
npm install

# This installs:
# ├─ next.js 16
# ├─ react 19
# ├─ tailwindcss 3
# ├─ framer-motion (animations)
# ├─ @supabase/supabase-js
# ├─ @google/generative-ai
# ├─ youtube-transcript-api
# ├─ shadcn/ui components
# ├─ lucide-react icons
# └─ zod (validation)
```

### Step 3️⃣: Setup Environment Variables

Create `.env.local` file in project root:

```env
# ======================================
# 🔑 GOOGLE GEMINI AI CONFIGURATION
# ======================================
GEMINI_API_KEY="AIzaSyD...your_key_here...fG8Z"
GEMINI_MODEL="gemini-2.5-flash"

# ======================================
# 🗄️ SUPABASE DATABASE CONFIGURATION
# ======================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc...your_anon_key...XFz"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc...your_service_key...abc"

# ======================================
# 🌍 APPLICATION SETTINGS
# ======================================
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
LOG_LEVEL="info"

# ======================================
# 📊 OPTIONAL: ANALYTICS & MONITORING
# ======================================
NEXT_PUBLIC_ANALYTICS_ID="UA-XXXXXXXXX-X"
SENTRY_DSN="https://...@sentry.io/..."
```

**⚠️ SECURITY WARNING:**
```bash
# Add to .gitignore (DO NOT COMMIT KEYS!)
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### Step 4️⃣: Database Schema Setup

**Option A: Using Supabase SQL Editor (Easiest)**

Go to Supabase Dashboard → SQL Editor → Paste this:

```sql
-- ╔════════════════════════════════════════════════════════════╗
-- ║         YOUTUBE STUDY ASSISTANT DATABASE SCHEMA            ║
-- ║                    Ready to Copy & Paste                   ║
-- ╚════════════════════════════════════════════════════════════╝

-- ════════════════════════════════════════════════════════════════
-- TABLE: STUDY MODULES (Core data)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS study_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  video_title TEXT,
  video_duration INTEGER,
  transcript TEXT,
  summary TEXT,
  key_points TEXT[],
  thumbnail_url TEXT,
  processing_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_study_modules_user_id ON study_modules(user_id);
CREATE INDEX idx_study_modules_created_at ON study_modules(created_at DESC);
CREATE INDEX idx_study_modules_status ON study_modules(processing_status);

-- ════════════════════════════════════════════════════════════════
-- TABLE: FLASHCARDS (Learning materials)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_module_id UUID REFERENCES study_modules(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_flashcards_study_module_id ON flashcards(study_module_id);
CREATE INDEX idx_flashcards_difficulty ON flashcards(difficulty_level);

-- ════════════════════════════════════════════════════════════════
-- TABLE: MCQ QUESTIONS (Quiz content)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mcqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_module_id UUID REFERENCES study_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  times_attempted INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_mcqs_study_module_id ON mcqs(study_module_id);
CREATE INDEX idx_mcqs_difficulty ON mcqs(difficulty_level);

-- ════════════════════════════════════════════════════════════════
-- TABLE: REVISION SHEETS (Quick summaries)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS revision_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_module_id UUID REFERENCES study_modules(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  bullet_points TEXT[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_revision_sheets_study_module_id ON revision_sheets(study_module_id);

-- ════════════════════════════════════════════════════════════════
-- TABLE: NOTE CHUNKS (Searchable content)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS note_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_module_id UUID REFERENCES study_modules(id) ON DELETE CASCADE,
  chunk_number INTEGER,
  content TEXT,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_note_chunks_study_module_id ON note_chunks(study_module_id);

-- ════════════════════════════════════════════════════════════════
-- TABLE: MOCK TESTS (Progress tracking)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  study_module_id UUID REFERENCES study_modules(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  percentage DECIMAL(5,2),
  time_taken INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_mock_tests_user_id ON mock_tests(user_id);
CREATE INDEX idx_mock_tests_created_at ON mock_tests(created_at DESC);

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════

ALTER TABLE study_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;

-- Study Modules Policies
CREATE POLICY "Users can view their own study modules"
  ON study_modules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert study modules"
  ON study_modules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their study modules"
  ON study_modules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their study modules"
  ON study_modules FOR DELETE
  USING (auth.uid() = user_id);

-- Flashcards Policies (inherit from study_modules)
CREATE POLICY "Users can view flashcards from their modules"
  ON flashcards FOR SELECT
  USING (
    study_module_id IN (
      SELECT id FROM study_modules WHERE user_id = auth.uid()
    )
  );

-- Similar policies for mcqs, revision_sheets, note_chunks, mock_tests...

-- ════════════════════════════════════════════════════════════════
-- DONE! Schema is ready to use 🎉
-- ════════════════════════════════════════════════════════════════
```

**Run this SQL to create everything automatically!** ✅

### Step 5️⃣: Start Development Server

```bash
# Start the development server
npm run dev

# You should see:
# ✓ Ready in 2.3s
# ✓ App is running at http://localhost:3000

# Open browser and paste: http://localhost:3000
# 🎉 BOOM! You're live!
```

**Troubleshooting:**
```bash
# If port 3000 is busy:
npm run dev -- -p 3001

# If dependencies have issues:
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 How to Use

### 🎬 **Step 1: Paste YouTube URL**

```
┌─────────────────────────────────────────┐
│  🔗 Paste YouTube Link                  │
├─────────────────────────────────────────┤
│                                         │
│  https://www.youtube.com/watch?v=...   │
│                                         │
│          [🚀 Generate Module]           │
│                                         │
└─────────────────────────────────────────┘
```

**Supports:**
- ✅ Full YouTube URLs
- ✅ Short YouTube URLs (youtu.be)
- ✅ Videos with captions/subtitles
- ✅ Playlist videos
- ✅ Educational & technical content

### 📚 **Step 2: Explore Interactive Tabs**

```
┌──────────────────────────────────────────────────┐
│  📝 Notes  │ 🎯 Cards  │ ❓ Quiz  │ ⚡ Quick    │
├──────────────────────────────────────────────────┤
│                                                  │
│  📝 Study Notes Tab:                            │
│  • Complete lecture transcription              │
│  • Structured with headings & subheadings      │
│  • Timestamp links to video                    │
│  • Highlighted key concepts                    │
│                                                  │
│  🎯 Flashcard Tab:                              │
│  • Click card to flip                          │
│  • Track mastery                               │
│  • Shuffle & practice mode                     │
│                                                  │
│  ❓ MCQ Quiz Tab:                               │
│  • Answer questions                            │
│  • Instant feedback                            │
│  • Review explanations                         │
│  • See score & analytics                       │
│                                                  │
│  ⚡ Quick Revision Tab:                         │
│  • Bullet-point summary                        │
│  • Perfect for last-minute prep                │
│  • Print-friendly format                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 🎯 **Features in Action**

**Flashcard Example:**
```
┌─────────────────────────────────────┐
│                                     │
│          [CLICK TO FLIP] ↻          │
│                                     │
│   🎓 What is Machine Learning?     │
│                                     │
│                                     │
│           [← PREVIOUS]  [NEXT →]   │
│                                     │
│      Progress: 12/50 cards          │
│                                     │
└─────────────────────────────────────┘

↓ [CLICK] ↓

┌─────────────────────────────────────┐
│                                     │
│          [CLICK TO FLIP] ↻          │
│                                     │
│  ML is a branch of AI that learns  │
│  patterns from data without being  │
│  explicitly programmed.            │
│                                     │
│           [← PREVIOUS]  [NEXT →]   │
│                                     │
│      Progress: 12/50 cards          │
│                                     │
└─────────────────────────────────────┘
```

**MCQ Quiz Example:**
```
┌─────────────────────────────────────────────┐
│  Question 5 of 10                           │
├─────────────────────────────────────────────┤
│                                             │
│  What is the capital of France?             │
│                                             │
│  ☐ A) London                                │
│  ☐ B) Berlin                                │
│  ☑ C) Paris                        ✅ CORRECT!
│  ☐ D) Madrid                                │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Explanation:                               │
│  Paris is the capital city of France,       │
│  located in the northern central part       │
│  of the country...                          │
│                                             │
│  [← PREVIOUS]            [NEXT →]           │
│                                             │
│  Score: 4/5 (80%)                           │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Overview

```
                    ┌─────────────────────┐
                    │   USER BROWSER      │
                    │  (React 19 + UI)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   NEXT.JS 16        │
                    │  API ROUTES & SSR   │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │  Gemini    │      │  Supabase  │      │  YouTube   │
    │  2.0 Flash │      │ PostgreSQL │      │ Transcript │
    │   (AI)     │      │ (Database) │      │   (Data)   │
    └────────────┘      └────────────┘      └────────────┘
```

### Data Flow:

```
1️⃣  USER SUBMITS URL
    ↓
2️⃣  EXTRACT TRANSCRIPT
    └─ youtube-transcript API
    ↓
3️⃣  GENERATE PRIMARY CONTENT
    └─ Gemini 2.0 Flash → Study Notes (INSTANT)
    ↓
4️⃣  SAVE TO DATABASE
    └─ Supabase PostgreSQL
    ↓
5️⃣  BACKGROUND PROCESSING (ASYNC)
    ├─ Generate MCQs
    ├─ Create Flashcards
    ├─ Build Embeddings
    └─ Create Revision Sheet
    ↓
6️⃣  USER SEES CONTENT UPDATING
    └─ Real-time UI updates as tasks complete
```

---

## 🎨 Animation Showcase

### **Page Load Fade-In** (300ms)
```
Opacity:  0% ──────► 100%
          Ease-out curve
          Smooth & elegant
```

### **Card Stagger** (100ms delay)
```
Card 1: ↓ (0ms)
Card 2:   ↓ (100ms)
Card 3:     ↓ (200ms)
Card 4:       ↓ (300ms)
        Creates waterfall effect
```

### **Flashcard Flip** (600ms)
```
       Front              Back
         │                │
    [CARD]           [CARD]
      │ │              │ │
      │ └──────────────┘ │
      └────────────────────┘
   Rotates on Y-axis smoothly
   Spring physics applied
```

### **Button Interactions**
```
Normal:   Scale 1.0
Hover:    Scale 1.05 + Glow
Click:    Scale 0.95 (press feel)
          All 150ms smooth transitions
```

### **Success Feedback**
```
✅ Emerald glow pulse
   Opacity: 50% → 100% → 50%
   Duration: 500ms × 2 cycles
   Color: #10B981 (emerald)
```

### **Error Feedback**
```
❌ Shake animation
   X movement: -5px ↔ +5px
   Duration: 300ms total
   4 shakes for impact
   Color: #EF4444 (red)
```

---

## 🔧 Configuration & Customization

### Change Animation Speed

Edit `components/animations.ts`:

```typescript
// Slow down animations (multiply by 1.5)
export const ANIMATION_DURATION = {
  fade: 450,        // was 300ms
  card: 900,        // was 600ms
  button: 225,      // was 150ms
  stagger: 150      // was 100ms
};

// Speed up animations (divide by 1.5)
export const ANIMATION_DURATION = {
  fade: 200,
  card: 400,
  button: 100,
  stagger: 65
};
```

### Customize Color Scheme

Edit `tailwind.config.js`:

```javascript
theme: {
  colors: {
    primary: '#10B981',    // Main accent
    dark: '#0F172A',       // Background
    accent: '#F59E0B',     // Secondary
    success: '#10B981',    // Correct answer
    error: '#EF4444',      // Wrong answer
    warning: '#F97316'     // Important
  }
}
```

### Adjust AI Response Length

Edit `api/process-video.ts`:

```typescript
// Short videos (< 10 min): concise notes
// Medium videos (10-30 min): detailed notes
// Long videos (> 30 min): comprehensive notes

const getNotesLength = (duration: number) => {
  if (duration < 600) return "brief and focused";
  if (duration < 1800) return "detailed with examples";
  return "comprehensive with deep analysis";
};
```

---

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, add environment variables in dashboard
# Deploy done! 🎉
```

### **Deploy to Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build & run
docker build -t study-assistant .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  study-assistant
```

### **Production Checklist**

```
✅ Set NODE_ENV="production"
✅ Enable HTTPS/SSL
✅ Configure CORS
✅ Set up rate limiting
✅ Enable database backups
✅ Add error monitoring (Sentry)
✅ Set up analytics
✅ Test error pages
✅ Optimize images
✅ Configure CDN
✅ Add security headers
✅ Enable caching
```

---

## 🐛 Troubleshooting

### ❌ "Invalid API Key" Error

**Solution:**
```bash
1. Check .env.local has GEMINI_API_KEY
2. Verify key hasn't expired on Google Cloud
3. Ensure key has Generative Language API enabled
4. Try regenerating key on aistudio.google.com
```

### ❌ Transcript Won't Extract

**Solution:**
```bash
# Update package
npm update youtube-transcript-api

# Try:
1. Video must have captions enabled
2. Copy video ID from URL
3. Check video isn't age-restricted
4. Try different video first
```

### ❌ Port 3000 Already in Use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill existing process:
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ Database Connection Failed

**Solution:**
```bash
1. Check NEXT_PUBLIC_SUPABASE_URL is correct
2. Verify SUPABASE_ANON_KEY is not expired
3. Ensure Supabase project isn't paused
4. Test with curl:
   curl https://your.supabase.co/rest/v1/study_modules \
     -H "apikey: your_key"
```

---

## 📁 Project Structure

```
study-assistant/
├── 📁 app/
│   ├── 📄 layout.tsx              ← Root layout
│   ├── 📄 page.tsx                ← Home page
│   ├── 📁 api/
│   │   ├── 📄 process-video.ts    ← Main endpoint
│   │   ├── 📄 generate-mcqs.ts    ← MCQ generation
│   │   └── 📄 [...].ts            ← Other endpoints
│   └── 📁 study/
│       └── [moduleId]/
│           └── 📄 page.tsx        ← Study interface
│
├── 📁 components/
│   ├── 📄 StudyModule.tsx         ← Main component
│   ├── 📄 Flashcard.tsx           ← Flashcard with animations
│   ├── 📄 MCQQuiz.tsx             ← Quiz interface
│   ├── 📄 RevisionSheet.tsx       ← Quick review
│   ├── 📄 Animations.tsx          ← Animation configs
│   └── 📁 ui/                     ← shadcn components
│
├── 📁 lib/
│   ├── 📄 supabase.ts             ← DB client
│   ├── 📄 gemini.ts               ← AI wrapper
│   ├── 📄 youtube.ts              ← Transcript extraction
│   └── 📄 utils.ts                ← Helpers
│
├── 📁 styles/
│   └── 📄 globals.css             ← Global styles
│
├── 📁 public/
│   └── [images & assets]
│
├── 📄 .env.local                  ← Environment (DON'T COMMIT!)
├── 📄 tailwind.config.js          ← Tailwind config
├── 📄 next.config.js              ← Next.js config
├── 📄 tsconfig.json               ← TypeScript config
├── 📄 package.json                ← Dependencies
├── 📄 README.md                   ← This file!
└── 📄 .gitignore                  ← Git ignore rules
```

---

## 🤝 Contributing

### **Fork & Create Branch**

```bash
git clone https://github.com/YOUR_USERNAME/yt-video-summarizer.git
cd yt-video-summarizer
git checkout -b feature/your-feature-name
```

### **Make Changes**

```bash
# Make your improvements
# Test thoroughly
# Add comments if complex
```

### **Commit & Push**

```bash
git add .
git commit -m "✨ Add amazing feature"
git push origin feature/your-feature-name
```

### **Create Pull Request**

1. Go to GitHub
2. Create Pull Request
3. Describe changes clearly
4. Wait for review

---

## 📄 License

MIT License - Free for personal & commercial use

```
Copyright (c) 2024 Bhargav Tej Agolla

Permission is hereby granted, free of charge, to any person 
obtaining a copy of this software...
```

---

## 🌐 Resources

```
📚 OFFICIAL DOCS
├─ Next.js:       https://nextjs.org/docs
├─ React:         https://react.dev
├─ Tailwind:      https://tailwindcss.com/docs
├─ Supabase:      https://supabase.com/docs
├─ Gemini:        https://ai.google.dev/docs
└─ Framer Motion: https://www.framer.com/motion/

🛠️ USEFUL TOOLS
├─ Vercel Deploy:     https://vercel.com
├─ API Testing:       https://postman.com
├─ Database UI:       https://adminer.org
└─ Code Editor:       https://cursor.com

💬 COMMUNITY
├─ GitHub Issues:     [Report bugs]
├─ Discussions:       [Ask questions]
└─ Discord:          [Join community]
```

---

## ⭐ Show Your Support

If this helped you, please:

```
🌟 Star this repo (top right)
🔗 Share with friends
📢 Follow for updates
💬 Leave feedback
```

---

## 📞 Support & Contact

```
📧 Email:    support@studyassistant.dev
💬 Discord:  [Join Community]
🐛 Issues:   [GitHub Issues]
📖 Wiki:     [Project Wiki]
```

### Report a Bug

Include:
- ✅ Steps to reproduce
- ✅ Expected behavior
- ✅ Actual behavior
- ✅ Screenshots/videos
- ✅ System info (OS, Node version)

---

## 🎯 Roadmap

```
✅ Completed:
   ✓ Video processing
   ✓ AI summarization
   ✓ Flashcards
   ✓ MCQs
   ✓ Revision sheets

🚧 In Progress:
   ⧗ PDF export
   ⧗ Real-time collaboration
   ⧗ Analytics dashboard

🔮 Coming Soon:
   ☆ Mobile app (React Native)
   ☆ Browser extension
   ☆ Offline mode
   ☆ Custom AI training
   ☆ Group study features
   ☆ AI tutor chat
```

---

<div align="center">

### ⚡ Start Learning Smarter Today ⚡

**[🚀 Get Started](#-quick-start)** • **[📖 Full Guide](#-installation--setup)** • **[💬 Support](#-support)**

```
   ╔════════════════════════════════════════╗
   ║  Made with ❤️ by students, for        ║
   ║  students who want to learn smarter.   ║
   ║                                        ║
   ║        ⭐ Star us on GitHub ⭐         ║
   ╚════════════════════════════════════════╝
```

**Questions? [Open an issue](https://github.com/bhargavatejagolla/yt-video-summarizer/issues)**

---

**Version 1.0.0** • **Last Updated:** July 2024 • **License:** MIT

</div>
