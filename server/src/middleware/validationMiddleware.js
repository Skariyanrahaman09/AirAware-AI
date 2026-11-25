/**
 * Centralized Input Validation Middleware
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Password: Minimum 8 characters, at least one letter and one number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const createValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: errors[0],
    errors,
  });
};

const validateRegister = (req, res, next) => {
  const { name, email, password, city } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
    errors.push('Name is required and must be between 2 and 50 characters.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8 || password.length > 72 || !PASSWORD_REGEX.test(password)) {
    errors.push('Password must be between 8 and 72 characters and contain both letters and numbers.');
  }

  if (city && (typeof city !== 'string' || city.trim().length > 100)) {
    errors.push('City must be a valid string under 100 characters.');
  }

  if (errors.length > 0) {
    return createValidationError(res, errors);
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  if (city) req.body.city = city.trim();
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length === 0 || password.length > 72) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return createValidationError(res, errors);
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

const validateChat = (req, res, next) => {
  const { query, city, lat, lon } = req.body || {};
  const errors = [];

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    errors.push('A valid text query is required.');
  } else if (query.trim().length > 1000) {
    errors.push('Query exceeds maximum allowed length of 1000 characters.');
  }

  if (lat !== undefined && (isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90)) {
    errors.push('Latitude must be a valid number between -90 and 90.');
  }

  if (lon !== undefined && (isNaN(Number(lon)) || Number(lon) < -180 || Number(lon) > 180)) {
    errors.push('Longitude must be a valid number between -180 and 180.');
  }

  if (errors.length > 0) {
    return createValidationError(res, errors);
  }

  req.body.query = query.trim();
  next();
};

const validateImpactCalculation = (req, res, next) => {
  const { commuteDistanceKm, daysPerWeek, carpoolOccupancy } = req.body || {};
  const errors = [];

  if (commuteDistanceKm !== undefined) {
    const km = Number(commuteDistanceKm);
    if (isNaN(km) || km < 0 || km > 500) {
      errors.push('Commute distance must be a positive number up to 500 km.');
    }
  }

  if (daysPerWeek !== undefined) {
    const days = Number(daysPerWeek);
    if (isNaN(days) || days < 1 || days > 7) {
      errors.push('Days per week must be between 1 and 7.');
    }
  }

  if (carpoolOccupancy !== undefined) {
    const occ = Number(carpoolOccupancy);
    if (isNaN(occ) || occ < 1 || occ > 10) {
      errors.push('Carpool occupancy must be between 1 and 10.');
    }
  }

  if (errors.length > 0) {
    return createValidationError(res, errors);
  }

  next();
};

const validateCommunityPost = (req, res, next) => {
  const { title, content, category } = req.body || {};
  const validCategories = ['smog_alert', 'indoor_hack', 'carpooling', 'clean_commute', 'general_advice'];
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) {
    errors.push('Title is required and must be between 3 and 120 characters.');
  }

  if (!content || typeof content !== 'string' || content.trim().length < 10 || content.trim().length > 1000) {
    errors.push('Content is required and must be between 10 and 1000 characters.');
  }

  if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}.`);
  }

  if (errors.length > 0) {
    return createValidationError(res, errors);
  }

  req.body.title = title.trim();
  req.body.content = content.trim();
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChat,
  validateImpactCalculation,
  validateCommunityPost,
  EMAIL_REGEX,
  PASSWORD_REGEX,
};
