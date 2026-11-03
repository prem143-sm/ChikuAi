/**
 * Chat-specific rate limiting for StudIQ.
 *
 * Limits chat requests to protect the Gemini API quota and prevent abuse.
 */

const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // max 20 chat requests per minute per IP
  message: {
    success: false,
    error: 'You are sending messages too quickly. Please wait a moment before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = chatRateLimiter;
