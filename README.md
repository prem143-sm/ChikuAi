# StudIQ

A kid-friendly AI learning companion with fresh Gemini activities for grades 5–9. Built with React, Vite, Node.js, Express, and Gemini.

## Features

- **Chat with StudIQ** — Friendly AI conversations (Hinglish + Simple English)
- **Maths Adventure, Science Explorer, English Practice, GK Quiz, Brain Gym, and Story Time** — Fresh, grade-aware Gemini activities for grades 5–9
- **Fresh content** — Avoids the last 100 activity labels for each activity, per guest browser or guardian account
- **My Progress** — Tracks completed activities, quiz scores, and topics; saves locally for guests or syncs to Firestore when a guardian signs in
- **Guardian Google sign-in** — Optional; children can continue as guests
- **Settings** — Language preference, privacy info, reset progress
- **Voice** — Optional browser speech synthesis and recognition

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

## Learning Activities and Progress

The six learning activities (maths, science, English, general knowledge quiz, brain gym, and stories) use Gemini to generate new grade 5–9 content. Configure `GEMINI_API_KEY` on the backend; these activities show an explicit setup or API error rather than repeating bundled examples when Gemini is unavailable. The chat experience is unchanged and retains its local fallback.

Guests can use the activities without signing in. Guest progress and recent activity labels stay in that browser. A parent or guardian can optionally sign in with Google from the dashboard to sync progress and repeat-prevention history across devices.

### Firebase setup for optional guardian sign-in

1. Create a Firebase project on the no-cost Spark plan, register a Web app, enable **Google** under Authentication providers, and create a Cloud Firestore database.
2. Publish the repository's [`firestore.rules`](./firestore.rules) in Firestore's Rules tab.
3. Copy `frontend/.env.example` to `frontend/.env` and fill in the Firebase Web app configuration values. These are client configuration values; protect Firestore with the supplied rules.
4. Add the same `VITE_FIREBASE_*` values to the Vercel project and redeploy. Add your local and deployed domains to Firebase Authentication's authorized domains.

Firebase Spark includes no-cost quotas and does not require a payment method; see [Firebase pricing](https://firebase.google.com/pricing). Quotas can change and usage beyond them may require a billing plan. Gemini API usage is separate and may have its own pricing or limits.

See [docs/SETUP.md](./docs/SETUP.md) and [docs/PRIVACY.md](./docs/PRIVACY.md) for setup and data-handling details.

## What Works Without a Gemini API Key

Guest progress reporting works locally. The six generated learning activities require a configured Gemini API key. Chat continues to use its local fallback when Gemini is not configured.

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
