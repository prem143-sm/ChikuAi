# StudIQ — Setup Guide

## Overview

StudIQ provides Gemini-generated learning activities for grades 5–9. It runs on a Windows laptop with a React + Vite frontend and a Node.js + Express backend.

## Step-by-Step Installation

### 1. Install Node.js

Download and install Node.js LTS from https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Open the Project Folder

```bash
cd "D:\Projects\StudIQ"
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```
GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-3.5-flash-lite
PORT=3001
NODE_ENV=development
```

Get an API key from https://aistudio.google.com/

> **Important:** Never share your API key. The `.env` file is excluded from Git via `.gitignore`.

### 4. Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
```

To enable optional guardian Google sign-in and cloud progress:

1. Create a Firebase project on the Spark plan and register a Web app.
2. In Firebase Authentication, enable the Google provider and add localhost plus your deployed domain to authorized domains.
3. Create a Cloud Firestore database and publish the root `firestore.rules` file.
4. Fill in the Firebase Web app values in `frontend/.env`:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_APP_ID=...
   ```

Without these values, the app continues in guest mode and stores progress and recent activity labels in the browser. Do not put a Firebase Admin/service-account key in the frontend.

### 5. Start the Application

Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

The frontend proxies `/api` requests to `http://localhost:3001` by default. If
the backend is running on another port, set `STUDIQ_API_PROXY_TARGET` before
starting Vite (for example, in PowerShell:
`$env:STUDIQ_API_PROXY_TARGET='http://localhost:3002'`).

Learning activities (maths, science, English practice, general knowledge quizzes, brain gym, and stories) require a Gemini API key and generate content for the selected grade 5–9. Each learner avoids their latest 100 activity labels per activity. Chat retains its existing local fallback.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check that port 3001 is free. Run `npm install` again. |
| Frontend won't start | Check that port 5173 is free. Run `npm install` again. |
| Learning activities say "Not found" | Restart the backend from this project, then point Vite's `STUDIQ_API_PROXY_TARGET` at that backend if it uses a non-default port. |
| Chat returns local fallback | The Gemini API key is missing, invalid, or unavailable. Check `backend/.env`. |
| Activities cannot generate | Add a valid Gemini API key to `backend/.env` and check API quota/network access. |
| Guardian sign-in is unavailable | Check `frontend/.env`, enable Google as an Authentication provider, and authorize the current domain in Firebase. |
| Cloud progress cannot load | Check the Firestore database and publish `firestore.rules`. |
| Build fails | Delete `node_modules` and `package-lock.json`, then `npm install` again. |
| Voice not working | Voice features depend on browser support. Try Chrome or Edge. |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Gemini API key from Google AI Studio | Required for generated learning activities; chat has a local fallback |
| `GEMINI_API_URL` | Gemini API base URL | No (defaults to `https://generativelanguage.googleapis.com/v1beta`) |
| `GEMINI_MODEL` | Model identifier | No (defaults to `gemini-3.5-flash-lite`) |
| `PORT` | Backend port | No (defaults to `3001`) |
| `NODE_ENV` | Node environment | No (defaults to `development`) |
| `VITE_FIREBASE_API_KEY` | Firebase Web app API key | No (guest mode works without it) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain | No (guest mode works without it) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID used for Firestore | No (guest mode works without it) |
| `VITE_FIREBASE_APP_ID` | Firebase Web app ID | No (guest mode works without it) |

For Vercel, add all four `VITE_FIREBASE_*` values and the Gemini backend variables in the project's Environment Variables, then redeploy. Firebase Spark provides no-cost quotas without a payment method; Gemini usage is separate and may be billed or rate-limited by Google.
