const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// General API rate limiting: 100 requests per 15 minutes per IP
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/', (req, res) => {
  res.json({ name: 'Chiku AI Backend', status: 'ok' });
});

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;