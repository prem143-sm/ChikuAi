/**
 * Centralized error handler for Chiku AI backend.
 *
 * Returns safe, predictable error responses without exposing internal
 * details or secrets to the frontend.
 */

function errorHandler(err, req, res, next) {
  console.error('Backend error:', err.message);

  const status = err.status || 500;

  let message = 'Something went wrong. Please try again.';
  if (status === 404) {
    message = 'Not found.';
  } else if (status === 429) {
    message = 'Too many requests. Please wait and try again.';
  } else if (status === 503) {
    message = 'Service temporarily unavailable. Please try again later.';
  } else if (status === 504) {
    message = 'The request took too long. Please try again.';
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;