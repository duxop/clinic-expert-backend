const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per window
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "You have reached the request limit. Try again in 15 minutes.",
    });
  },
});

module.exports = limiter;
