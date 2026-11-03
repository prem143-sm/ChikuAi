/**
 * Application-level response validation and safety checks for Chiku AI.
 *
 * Ensures replies are child-safe, within length limits, and free of
 * obviously unsafe patterns before they reach the frontend.
 */

const MAX_REPLY_CHARS = 1500;

const UNSAFE_PATTERNS = [
  /password/i,
  /credit card/i,
  /social security/i,
  /home address/i,
  /phone number/i,
  /explosive/i,
  /weapon/i,
  /self.?harm/i,
  /suicide/i,
];

const SAFE_FALLBACK =
  "I'm not able to answer that right now. Let's talk about something safe and fun instead!";

// Check if a message looks like it requests personal information or dangerous content
function containsUnsafePattern(text) {
  if (!text || typeof text !== 'string') {
    return true;
  }
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

function sanitizeReply(reply) {
  if (!reply || typeof reply !== 'string' || reply.trim().length === 0) {
    return { safe: false, reply: SAFE_FALLBACK };
  }

  let cleaned = reply.trim();

  // Strip any system-instruction leakage attempts
  cleaned = cleaned.replace(/system instruction/gi, '').trim();

  if (cleaned.length === 0) {
    return { safe: false, reply: SAFE_FALLBACK };
  }

  if (cleaned.length > MAX_REPLY_CHARS) {
    cleaned = cleaned.slice(0, MAX_REPLY_CHARS).trim();
  }

  if (containsUnsafePattern(cleaned)) {
    return { safe: false, reply: SAFE_FALLBACK };
  }

  return { safe: true, reply: cleaned };
}

function validateInput(message, language, mode) {
  const errors = [];

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push('Message is required.');
  } else {
    const trimmed = message.trim();
    if (trimmed.length > 1000) {
      errors.push('Message is too long. Please keep it under 1000 characters.');
    }
  }

  const supportedLanguages = ['english', 'hindi', 'hinglish', 'auto'];
  if (language && !supportedLanguages.includes(language)) {
    errors.push('Unsupported language.');
  }

  const supportedModes = ['learn', 'chat', 'quiz', 'story'];
  if (mode && !supportedModes.includes(mode)) {
    errors.push('Unsupported mode.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  MAX_REPLY_CHARS,
  UNSAFE_PATTERNS,
  SAFE_FALLBACK,
  containsUnsafePattern,
  sanitizeReply,
  validateInput,
};