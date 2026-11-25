/**
 * Security middleware: OWASP-compliant headers & NoSQL injection sanitization
 */

const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Cross-Site Scripting Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  // Strict-Transport-Security (HSTS) in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

/**
 * Recursive sanitizer to remove MongoDB operator injection keys ($where, $gt, etc.)
 */
function sanitizeInput(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip keys starting with '$' or containing '.' to prevent NoSQL query injection
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    sanitized[key] = typeof value === 'object' && value !== null ? sanitizeInput(value) : value;
  }
  return sanitized;
}

const noSqlSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
};

module.exports = {
  securityHeaders,
  noSqlSanitizer,
  sanitizeInput,
};
