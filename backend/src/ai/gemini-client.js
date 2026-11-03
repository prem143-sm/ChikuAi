/**
 * Gemini API client for StudIQ.
 * The API key is read only by the backend and is never returned to the browser.
 */

const REQUEST_TIMEOUT_MS = 25000;
const MAX_RESPONSE_CHARS = 1500;

function getGenerateContentUrl(apiUrl, model) {
  const baseUrl = (apiUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
  return `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;
}

function buildGeminiRequest(systemInstruction, messages, generationConfig = {}) {
  return {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: messages.map(({ role, content }) => ({
      role: role === 'assistant' ? 'model' : 'user',
      parts: [{ text: content }],
    })),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 400,
      ...generationConfig,
    },
  };
}

function extractTextFromResponse(responseJson) {
  const parts = responseJson?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts.map((part) => part.text).filter((part) => typeof part === 'string').join('').trim();
  return text || null;
}

async function callGemini({
  apiKey,
  apiUrl,
  model,
  systemInstruction,
  messages,
  generationConfig,
  maxResponseChars = MAX_RESPONSE_CHARS,
}) {
  if (typeof fetch !== 'function') {
    return { success: false, error: 'This Node.js version does not provide fetch.', status: 500 };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getGenerateContentUrl(apiUrl, model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(buildGeminiRequest(systemInstruction, messages, generationConfig)),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { success: false, error: `Upstream error (${response.status})`, status: response.status };
    }

    const text = extractTextFromResponse(await response.json());
    if (!text) {
      return { success: false, error: 'Empty or unreadable response from AI provider.', status: 502 };
    }

    return { success: true, reply: text.slice(0, maxResponseChars).trim(), provider: 'gemini' };
  } catch (err) {
    if (err.name === 'AbortError') return { success: false, error: 'The AI provider took too long to respond.', status: 504 };
    return { success: false, error: 'Unable to reach the AI provider.', status: 503 };
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  callGemini,
  REQUEST_TIMEOUT_MS,
  MAX_RESPONSE_CHARS,
  getGenerateContentUrl,
  buildGeminiRequest,
  extractTextFromResponse,
};
