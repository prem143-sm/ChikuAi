// Vercel catch-all serverless function. It exposes the existing Express API
// at /api/health and /api/chat without exposing any provider credentials.
module.exports = require('../backend/src/app');
