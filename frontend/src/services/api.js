const API_BASE = '/api';

export const api = {
  async health() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async chat(message, language = 'auto', mode = 'chat', history = []) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, mode, history }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Chat request failed');
    }
    return res.json();
  },

  async generateActivity(activity, grade, language, excludedLabels, difficulty) {
    const res = await fetch(`${API_BASE}/activities/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, grade, language, excludedLabels, difficulty }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(result.error || 'Could not generate a fresh activity.');
      error.status = res.status;
      throw error;
    }
    return result;
  },
};
