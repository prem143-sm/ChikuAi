const express = require('express');
const { generateActivity, ACTIVITY_TYPES, MAX_EXCLUDED_ITEMS, MAX_LABEL_LENGTH } = require('../ai/activity-generator');
const chatRateLimiter = require('../middleware/rate-limit');

const router = express.Router();
const GRADES = ['5', '6', '7', '8', '9'];
const LANGUAGES = ['english', 'hindi', 'hinglish'];
const DIFFICULTIES = ['easy', 'medium', 'challenging'];

router.use(chatRateLimiter);

router.post('/generate', async (req, res) => {
  const {
    activity, grade, language = 'english', excludedLabels = [], difficulty,
  } = req.body || {};
  if (!ACTIVITY_TYPES.includes(activity)) {
    return res.status(400).json({ success: false, error: 'Choose a supported learning activity.' });
  }
  if (!GRADES.includes(String(grade))) {
    return res.status(400).json({ success: false, error: 'Choose a school grade from 5 to 9.' });
  }
  if (!LANGUAGES.includes(language)) {
    return res.status(400).json({ success: false, error: 'Choose English, Hindi, or Hinglish.' });
  }
  if (activity === 'maths' && difficulty !== undefined && !DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ success: false, error: 'Choose a valid maths difficulty.' });
  }
  const validExcludedLabels = Array.isArray(excludedLabels)
    && excludedLabels.length <= MAX_EXCLUDED_ITEMS
    && excludedLabels.every((label) => typeof label === 'string'
      && label.trim().length > 0 && label.length <= MAX_LABEL_LENGTH);
  if (!validExcludedLabels) {
    return res.status(400).json({ success: false, error: 'Recent activity history is invalid.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('PASTE_YOUR')) {
    return res.status(503).json({
      success: false,
      error: 'Gemini is not configured. Add GEMINI_API_KEY to the backend environment to use AI learning activities.',
    });
  }

  const result = await generateActivity({
    apiKey,
    apiUrl: process.env.GEMINI_API_URL,
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    activity,
    grade: String(grade),
    language,
    excludedLabels: excludedLabels.map((label) => label.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim()),
    difficulty,
  });
  if (!result.success) {
    return res.status(result.status >= 400 && result.status < 600 ? result.status : 502).json({
      success: false,
      error: result.error || 'Gemini could not generate a valid activity. Please try again.',
    });
  }
  return res.json({ success: true, activity: result.data });
});

module.exports = router;
