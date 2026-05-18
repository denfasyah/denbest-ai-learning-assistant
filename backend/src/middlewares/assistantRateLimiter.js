const rateLimitCache = new Map();

// Periodic cleanup of rate limit cache
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (record.length === 0 || now - record[record.length - 1] > 600000) {
      rateLimitCache.delete(key);
    }
  }
}, 300000);

const limitPerUser = (type, limit, windowMs) => {
  return (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const key = `${userId}:${type}`;
    const now = Date.now();

    if (!rateLimitCache.has(key)) {
      rateLimitCache.set(key, []);
    }

    const timestamps = rateLimitCache.get(key);
    const activeTimestamps = timestamps.filter(t => now - t < windowMs);
    rateLimitCache.set(key, activeTimestamps);

    if (activeTimestamps.length >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Terlalu banyak request, tunggu sebentar ya'
      });
    }

    activeTimestamps.push(now);
    next();
  };
};

module.exports = {
  createConversationLimiter: limitPerUser('create_conv', 5, 60000),      // 5 per minute
  sendMessageLimiter: limitPerUser('send_message', 10, 60000),          // 10 per minute
  uploadLimiter: (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const key = `${userId}:upload`;
    const now = Date.now();

    if (!rateLimitCache.has(key)) {
      rateLimitCache.set(key, []);
    }

    const timestamps = rateLimitCache.get(key);
    const activeTimestamps = timestamps.filter(t => now - t < 600000); // 10 minutes window
    rateLimitCache.set(key, activeTimestamps);

    if (activeTimestamps.length >= 10) {
      return res.status(429).json({
        success: false,
        message: 'Terlalu banyak upload file, coba lagi nanti ya'
      });
    }

    activeTimestamps.push(now);
    next();
  }
};
