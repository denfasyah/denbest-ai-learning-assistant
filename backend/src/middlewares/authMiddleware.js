const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized to access this route');
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const error = new Error('No user found with this id');
      error.status = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    error.status = 401;
    error.message = 'Token is invalid or expired';
    next(error);
  }
};

module.exports = {
  verifyToken
};
