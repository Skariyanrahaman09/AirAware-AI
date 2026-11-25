const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isTest = process.env.NODE_ENV === 'test';
const JWT_SECRET = process.env.JWT_SECRET || (isTest ? 'airaware-test-secret-only-do-not-use-outside-tests' : null);

if (!JWT_SECRET || (!isTest && JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters before starting the API.');
}

const getBearerToken = (req) => {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice(7).trim();
  return token || null;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req) || req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    if (!decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (decoded.id) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) req.user = user;
      }
    }
  } catch (err) {
    // Invalid optional credentials do not grant a user identity.
  }
  return next();
};

const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  algorithm: 'HS256',
});

module.exports = { requireAuth, optionalAuth, generateToken, JWT_SECRET };
