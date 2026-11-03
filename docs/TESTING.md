# StudIQ Testing Guide

## Automated Tests

Run backend activity-generation validation tests:

```bash
cd backend
npm test
```

Run the frontend production build:

```bash
npm run build
```

## Manual Testing Checklist

### Setup and navigation

- [ ] Frontend starts at `http://localhost:5173`
- [ ] Backend starts at `http://localhost:3001`
- [ ] Dashboard and every feature page open on desktop and mobile
- [ ] Guest learning remains available without Firebase configuration
- [ ] School grade can be selected from 5 through 9 and persists after refresh

### Gemini-generated activities

- [ ] Maths, Science, English Practice, GK Quiz, Brain Gym, and Story Time generate grade-appropriate content
- [ ] Refreshing an activity or choosing its next item asks Gemini for new content
- [ ] The latest 100 activity labels are excluded for each guest browser or signed-in guardian account
- [ ] Gemini missing, invalid, rate-limited, or unavailable shows a clear error rather than repeating local examples
- [ ] Maths answers are checked; a completed quiz displays a score and explanation
- [ ] Science facts, practiced vocabulary, solved puzzles, read stories, correct maths, and completed quizzes update progress

### Optional guardian account and progress

- [ ] Enable Google sign-in and Firestore in a Firebase test project; publish `firestore.rules`
- [ ] Guest activity and quiz scores appear in the local progress report
- [ ] Guardian sign-in merges guest progress and recent labels into the guardian account
- [ ] A signed-in guardian can view the same report and recent-content history on another device
- [ ] Firestore denies reads and writes to another user's progress and history
- [ ] Progress reset updates the report and shows storage failures explicitly
- [ ] Sign-out switches to guest mode without exposing the guardian's cloud report

### Chat (unchanged)

- [ ] Chat sends and receives messages
- [ ] Suggested questions, voice read-aloud, and voice input work where supported
- [ ] Empty or long messages show validation errors
- [ ] Gemini chat and local fallback behavior remain intact

### Safety and privacy

- [ ] Gemini API key never reaches the frontend
- [ ] Generated responses are checked for valid shapes and unsafe content
- [ ] No child name, email, school, or Firebase user ID is included in Gemini requests
