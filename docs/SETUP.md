# StudIQ — Setup Guide

## Overview

StudIQ is a local-first educational application for children aged 6–10. It runs on a Windows laptop with a React + Vite frontend and a Node.js + Express backend.

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
cd "D:\Projects\ChikuAi"
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
```

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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check that port 3001 is free. Run `npm install` again. |
| Frontend won't start | Check that port 5173 is free. Run `npm install` again. |
| Chat returns local fallback | The Gemini API key is missing, invalid, or unavailable. Check `backend/.env`. |
| Build fails | Delete `node_modules` and `package-lock.json`, then `npm install` again. |
| Voice not working | Voice features depend on browser support. Try Chrome or Edge. |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Gemini API key from Google AI Studio | No (local mode works without it) |
| `GEMINI_API_URL` | Gemini API base URL | No (defaults to `https://generativelanguage.googleapis.com/v1beta`) |
| `GEMINI_MODEL` | Model identifier | No (defaults to `gemini-3.5-flash-lite`) |
| `PORT` | Backend port | No (defaults to `3001`) |
| `NODE_ENV` | Node environment | No (defaults to `development`) |
