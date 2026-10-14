# QuizMaster — AI-Powered Online Examination & Test Prep Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-green?style=for-the-badge&logo=vitest)](https://vitest.dev/)

**QuizMaster** is an online examination and competitive test preparation platform built for students targeting **UPSC Civil Services, SSC CGL, Banking (IBPS/SBI PO), Railways (RRB NTPC), Defense (NDA/CDS), State PSCs, and GATE Computer Science**.

---

## 🌟 Key Features

- **📱 Mobile Number + OTP Authentication**: Real SMS delivery with support for Twilio, MSG91, Fast2SMS, and Supabase Phone Auth. 6-digit auto-advancing OTP input, paste handling, backspace navigation, resend cooldown timers, and masked destination numbers.
- **⚡ Permanent Relational PostgreSQL Database**: Complete relational schema with 17 tables, Row Level Security (RLS) policies, and atomic write persistence ensuring zero data loss across restarts.
- **📚 Multi-Exam Catalog**: Dedicated syllabi, subject drills, and full-length timed mock tests across Government, Technical, and General Learning tracks.
- **⏱️ Comprehensive Quiz Engine**:
  - One-question-at-a-time interface with Previous / Next navigation.
  - Interactive color-coded Question Palette (Answered, Unanswered, Marked for Review).
  - Server-controlled countdown timer with auto-submit on expiration.
  - Real-time autosave (`/api/quiz/save-progress`) and in-progress attempt state recovery upon reload.
  - Anti-cheating security: correct answer keys are withheld on the client during active tests.
- **🎯 Server-Side Scoring & Analytics**: Server-evaluated marks, configurable negative marking (e.g. -0.25, -0.33), post-test question breakdown with conceptual explanations, and personal performance dashboards powered by **Recharts**.
- **📅 Daily Practice & Current Affairs**: Daily Question of the Day with instant feedback, streak tracking, and verified current affairs fact sheets with official government citations.
- **🏆 Gamification & All-India Leaderboard**: Dynamic rankings, XP point calculations, and unlockable achievement badges (Centurion, Speed Demon, 7-Day Warrior, Civil Servant).
- **🛡️ Full Admin Control Panel (`/admin`)**:
  - Quiz authoring and duration / negative marking configuration.
  - Question Bank with AI Approvals Queue.
  - Bulk CSV question importer with format validation.
  - Automated Daily Question Scheduler controls with job execution history and duplicate detection.
  - Aspirant accounts and role management.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/swayamgulhane538/QuizMaster.git
cd QuizMaster
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and add your service credentials:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (optional cloud sync) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `GEMINI_API_KEY` | Google Gemini API key for automated question generation |
| `SMS_PROVIDER` | SMS provider (`"development"`, `"twilio"`, `"fast2sms"`, or `"msg91"`) |
| `CRON_SECRET` | Secret token to authenticate automated daily question scheduler |
| `ADMIN_SECRET_KEY` | Master secret key for administrative bootstrapping |

### 3. Run Automated Tests
```bash
npm test
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🏛️ Database Migrations

PostgreSQL migrations are located under `supabase/migrations/`:
- `001_initial_schema.sql`: Core tables, constraints, foreign keys, and indexes.
- `002_rls_policies.sql`: Row Level Security policies for user isolation and admin access.
- `003_seed_data.sql`: Seed data for initial achievements, categories, and verified PYQs.

---

## 🧪 Testing Suite

- **Unit Tests**: Phone validator, OTP hashing, duplicate detection (Jaccard similarity), CSV parser, and negative marking scoring engine.
- **End-to-End Tests**: Full HTTP simulation in `tests/e2e/verify-full-system.js`.

---

## 📜 License
MIT License. Built for competitive examination aspirants.