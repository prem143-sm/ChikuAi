require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const aiConfigured = !!process.env.GEMINI_API_KEY;
  console.log(`\n========================================`);
  console.log(`  StudIQ Backend running`);
  console.log(`  Server: http://${HOST}:${PORT}`);
  console.log(`  Health: http://${HOST}:${PORT}/api/health`);
  console.log(`  Gemini AI: ${aiConfigured ? 'CONFIGURED' : 'NOT CONFIGURED (local mode only)'}`);
  console.log(`========================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  process.exit(1);
});
