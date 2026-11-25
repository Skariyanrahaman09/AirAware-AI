const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Keep diagnostic details in server logs; never send stacks or raw errors to clients.
  console.error('[Error Middleware]', {
    name: err.name,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((value) => value.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `An account with that ${field} already exists.` });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid authorization token.' });
  }

  const statusCode = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 500
    ? err.statusCode
    : 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
  });
};

module.exports = { notFoundHandler, errorHandler };
