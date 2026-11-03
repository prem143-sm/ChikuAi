const express = require('express');
const router = express.Router();
const { callGemini } = require('../ai/gemini-client');
const {
  getSystemInstruction,
  getSafeFallback,
} = require('../ai/chiku-personality');
const { validateInput, sanitizeReply } = require('../ai/response-validator');
const { validateChatRequest } = require('../middleware/request-validation');
const chatRateLimiter = require('../middleware/rate-limit');

router.use(validateChatRequest);
router.use(chatRateLimiter);

const LOCAL_FAQ = [
  {
    keywords: ['sky', 'blue', 'sunlight'],
    reply:
      "Sunlight has many colours. Air scatters blue light more, so the sky usually looks blue!",
  },
  {
    keywords: ['dinosaur', 'dinosaurs'],
    reply:
      "Dinosaurs like T. rex are extinct. But modern birds evolved from a group of dinosaurs!",
  },
  {
    keywords: ['plant', 'plants', 'grow'],
    reply:
      "Plants need sunlight, water, air, and nutrients to grow big and strong.",
  },
  {
    keywords: ['math', 'maths', 'addition', 'subtraction', 'multiply'],
    reply:
      "I can help with maths! Try asking me something like: what is 7 plus 5?",
  },
  {
    keywords: ['story', 'stories'],
    reply:
      "I can tell you stories! Would you like to hear about a brave little rabbit or a curious star?",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste'],
    reply:
      "Hello! I'm Chiku, your AI learning buddy. What would you like to learn today?",
  },
];

function findLocalFallback(message) {
  const lower = message.toLowerCase();
  for (const item of LOCAL_FAQ) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply;
    }
  }
  return null;
}

router.post('/', async (req, res) => {
  const { message, language = 'auto', mode = 'chat', history = [] } = req.body;

  const validation = validateInput(message, language, mode);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.errors.join(' '),
    });
  }

  const trimmedMessage = message.trim();
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  if (!apiKey || apiKey.includes('PASTE_YOUR')) {
    const localReply = findLocalFallback(trimmedMessage) || getSafeFallback();
    return res.json({
      success: true,
      reply: localReply,
      provider: 'local',
      message: 'Gemini is not configured. Using local responses.',
    });
  }

  try {
    const systemInstruction = getSystemInstruction();
    const messages = [
      ...history.map(({ role, content }) => ({ role, content: content.trim() })),
      { role: 'user', content: trimmedMessage },
    ];

    const geminiResult = await callGemini({ apiKey, apiUrl, model, systemInstruction, messages });

    if (!geminiResult.success) {
      const localReply = findLocalFallback(trimmedMessage) || getSafeFallback();
      return res.json({
        success: true,
        reply: localReply,
        provider: 'local',
        message: 'Gemini unavailable. Using local response.',
      });
    }

    const validated = sanitizeReply(geminiResult.reply);
    if (!validated.safe) {
      const localReply = findLocalFallback(trimmedMessage) || getSafeFallback();
      return res.json({
        success: true,
        reply: localReply,
        provider: 'local',
        message: 'Response filtered for safety.',
      });
    }

    return res.json({
      success: true,
      reply: validated.reply,
      provider: 'gemini',
    });
  } catch (err) {
    console.error('Chat route error:', err.message);
    const localReply = findLocalFallback(trimmedMessage) || getSafeFallback();
    return res.json({
      success: true,
      reply: localReply,
      provider: 'local',
      message: 'Error occurred. Using local response.',
    });
  }
});

module.exports = router;
