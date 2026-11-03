/**
 * Request validation middleware for Chiku AI chat endpoint.
 */

function validateChatRequest(req, res, next) {
  const { message, language, mode, conversationId, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a message.',
    });
  }

  if (message.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long. Please keep it under 1000 characters.',
    });
  }

  const supportedLanguages = ['english', 'hindi', 'hinglish', 'auto'];
  if (language !== undefined && !supportedLanguages.includes(language)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported language.',
    });
  }

  const supportedModes = ['learn', 'chat', 'quiz', 'story'];
  if (mode !== undefined && !supportedModes.includes(mode)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported mode.',
    });
  }

  // Sanitize conversationId - must be a non-identifying string if provided
  if (conversationId !== undefined && typeof conversationId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid conversation ID.',
    });
  }

  if (history !== undefined) {
    const validHistory = Array.isArray(history) && history.length <= 6 && history.every(
      (item) => item && ['user', 'assistant'].includes(item.role)
        && typeof item.content === 'string' && item.content.trim().length > 0
        && item.content.length <= 1000
    );
    if (!validHistory) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation context.',
      });
    }
  }

  next();
}

module.exports = {
  validateChatRequest,
};
