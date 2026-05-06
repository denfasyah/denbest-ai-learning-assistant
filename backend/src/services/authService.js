const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const register = async (userData) => {
  const { name, email, password } = userData;
  
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};

module.exports = {
  register,
  login
};
