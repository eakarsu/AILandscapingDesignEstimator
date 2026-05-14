const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

/**
 * Rate limiter for AI endpoints.
 * Allows 20 requests per 15 minutes per user or IP.
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded. Max 20 requests/hour.' },
  keyGenerator: (req, res) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id}`;
    }
    return ipKeyGenerator(req, res);
  },
});

/**
 * General API rate limiter.
 * Allows 200 requests per 15 minutes per IP.
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

module.exports = { aiRateLimiter, generalRateLimiter };
