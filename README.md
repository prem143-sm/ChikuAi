# StudIQ

A kid-friendly AI learning companion for children aged 6–10. Built with React, Vite, Node.js, Express, and Gemini.

## Features

- **Chat with Chiku** — Friendly AI conversations (Hinglish + Simple English)
- **Maths Adventure** — Addition, subtraction, multiplication practice
- **Science Explorer** — Curated science facts about space, animals, plants
- **English Practice** — Vocabulary with Hindi translations
- **General Knowledge Quiz** — Local question bank with explanations
- **Brain Gym** — Riddles and logic puzzles
- **Story Time** — Curated short stories with morals
- **My Progress** — Local progress tracking via localStorage
- **Settings** — Language preference, privacy info, reset progress
- **Voice** — Optional browser speech synthesis and recognition
- **Local-first** — All learning games work without a Gemini API key

## Architecture

```
studiq/
  frontend/          React + Vite frontend
  backend/           Node.js + Express backend
  docs/              Setup, privacy, and testing docs
```

## Quick Start

### Prerequisites

- Node.js LTS (v18 or higher)
- npm

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure the Gemini API key (optional)

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):

```
GEMINI_API_KEY=your_actual_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-3.5-flash-lite
PORT=3001
```

> The API key stays in the backend only. It is never sent to the browser.

### 3. Start the application

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

### 4. Stop the application

Press `Ctrl+C` in each terminal to stop the backend and frontend.

## What Works Without an API Key

All local learning features work immediately:
- Maths Adventure
- Science Explorer
- English Practice
- General Knowledge Quiz
- Brain Gym (riddles)
- Story Time
- My Progress

The chat feature uses local fallback responses when Gemini is not configured.

## Deploy to Vercel

This repository is ready for Vercel: the React app is built from `frontend/` and
the Express backend is deployed as a serverless function at `/api/*`.

1. Push this repository to GitHub and import it in [Vercel](https://vercel.com/new).
2. Leave the project root as the repository root. Vercel will use `vercel.json`.
3. In **Settings → Environment Variables**, add the following for Production,
   Preview, and Development:

   ```
   GEMINI_API_KEY=your_real_key
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```

4. Deploy. Do not upload or commit `backend/.env`; Vercel environment variables
   keep the API key on the server only.

After deployment, open `/api/health` to confirm the serverless API is healthy.

## Project Structure

See `docs/SETUP.md` for detailed setup instructions and `docs/PRIVACY.md` for privacy information.

## License

MIT
