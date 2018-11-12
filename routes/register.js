const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const User = require('../models/user');
const registerController = require('../controllers/registerController');

router.post('/', [
  body('email', 'Email is required').exists().isEmail().withMessage('Invalid email').custom((value, { req }) => {
    return User.findOne({ email: value })
      .then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
  }),
  body('password', 'Password is required').exists().isLength({ min: 5, max: 20}).withMessage('Password should have 5-20 characters'),
  body('name', 'Name is required').exists().isLength({ min: 5, max: 40}).escape().trim(),
  body('username', 'Username is required').exists().isAlphanumeric().withMessage('Username should be alpha-numeric').custom((value, { req }) => {
    return User.findOne({ username: value })
      .then(user => {
        if (user) {
          return Promise.reject('Username already in use');
        }
      });
  }),
  body('birthday', 'Birthday is required').exists().toDate(),
  body('gender', 'Gender is required').exists().isIn(['male', 'female', 'others']).withMessage('Gender invalid')
], registerController);

module.exports = router;