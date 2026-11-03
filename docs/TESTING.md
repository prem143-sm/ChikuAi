# StudIQ — Testing Guide

## Manual Testing Checklist

### Application

- [ ] Frontend starts at `http://localhost:5173`
- [ ] Backend starts at `http://localhost:3001`
- [ ] Dashboard loads with all feature cards
- [ ] Navigation works between all pages
- [ ] Application is responsive on desktop and mobile
- [ ] No buttons are decorative or nonfunctional

### Chat

- [ ] Welcome screen appears
- [ ] Chat sends and receives messages
- [ ] Suggested questions work
- [ ] Language selection changes interface language
- [ ] Voice read-aloud works (where supported)
- [ ] Voice input works (where supported)
- [ ] Empty message shows validation error
- [ ] Long message (>1000 chars) shows validation error
- [ ] Loading state shows while waiting for response
- [ ] Retry works after error

### Local Learning

- [ ] Maths Adventure generates questions
- [ ] Maths Adventure checks answers correctly
- [ ] Science Explorer shows facts with navigation
- [ ] English Practice shows words with translations
- [ ] Quiz loads questions and shows results
- [ ] Quiz explains correct/incorrect answers
- [ ] Brain Gym shows riddles with answers
- [ ] Story Time shows stories with morals
- [ ] Progress tracks activities
- [ ] Progress reset works with confirmation

### Gemini Integration (when API key configured)

- [ ] Valid API key enables Gemini chat
- [ ] Normal educational question returns an answer
- [ ] Follow-up question works
- [ ] Invalid API key falls back to local responses
- [ ] Missing configuration does not crash the app
- [ ] API key never reaches the frontend
- [ ] Secrets do not appear in logs

### Safety

- [ ] Unsafe requests get safe responses
- [ ] Personal information requests are discouraged
- [ ] Chiku identifies as AI when asked
- [ ] Dangerous activity requests are refused

## Running the Tests

There are no automated unit tests yet. Manual testing using the checklist above is required.

## Known Limitations

- Voice features depend on browser support (Chrome/Edge work best)
- Gemini chat requires a valid API key
- Progress is stored in browser localStorage only (clearing browser data clears progress)
