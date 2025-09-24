const express = require('express');
const authRoutes = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
require('dotenv').config();

authRoutes.post(
  '/register',
  validate([
    body('username').notEmpty().withMessage('Username required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ]),
  async (req, res) => {
    console.log('Registration request payload:', req.body);
    try {
      const { username, email, password } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.warn(`Registration failed: User with email ${email} already exists`);
        return res.status(400).json({ message: 'User already exists' });
      }

      bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
        }
        const user = new UserModel({ username, email, password: hash });
        await user.save();
        console.log(`New user registered with ID: ${user._id}`);
        res.status(201).json({
          message: 'You have been Successfully Registered!',
          user: { id: user._id, username: user.username, email: user.email },
        });
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(400).json({ error: err.message });
    }
  }
);

authRoutes.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ]),
  async (req, res) => {
    console.log('Login request received:', req.body);

    const { email, password } = req.body;
    try {
      const matchingUser = await UserModel.findOne({ email });
      if (!matchingUser) {
        console.warn(`Login failed: User with email ${email} not found`);
        return res.status(404).json({ message: 'User not found!' });
      }

      const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
      if (!isPasswordMatched) {
        console.warn(`Login failed: Invalid password attempt for user ${email}`);
        return res.status(400).json({ message: 'Invalid email or password!' });
      }

      console.log('Password matched, generating JWT token...');
      const token = jwt.sign(
        { userId: matchingUser._id, user: matchingUser.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      console.log(`Login successful! Token generated for user ID: ${matchingUser._id}`);
      res.status(200).json({
        message: 'You have been Successfully Logged in!',
        token,
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
);

module.exports = authRoutes;
