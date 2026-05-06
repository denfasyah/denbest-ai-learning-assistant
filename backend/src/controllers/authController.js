const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic Validation
    if (!name || name.length < 3) {
      const error = new Error('Name must be at least 3 characters');
      error.status = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }

    // MVP Requirement: @gmail.com only
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      const error = new Error('Only @gmail.com addresses are allowed for MVP');
      error.status = 400;
      throw error;
    }

    if (!password || password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.status = 400;
      throw error;
    }

    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
