const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
  const aiConfigured = !!process.env.GEMINI_API_KEY;

  res.json({
    success: true,
    status: 'ok',
    service: 'chiku-ai-backend',
    aiConfigured,
    localFallback: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
