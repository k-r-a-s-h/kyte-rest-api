const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const db = require('../util/database');
const registerController = require('../controllers/registerController');

router.post('/', [
  body('email', 'Email is required').exists().isEmail().withMessage('Invalid email').custom((value, { req }) => {
    return db.execute('SELECT 1 FROM users WHERE email = ?', [value])
      .then(([user]) => {
        if (user.length > 0) {
          return Promise.reject('E-mail already in use');
        }
      });
  }),
  body('password', 'Password is required').exists().isLength({ min: 5, max: 25}).withMessage('Password should have atleast 5 characters'),
  body('name', 'Name is required').exists().isLength({ min: 5, max: 40}).escape().trim(),
  body('username', 'Username is required').exists()
  .isLength({ min: 5, max: 25}).withMessage('Username should have atleast 5 characters')
  .isAlphanumeric().withMessage('Username should be alpha-numeric').custom((value, { req }) => {
    return db.execute('SELECT 1 FROM users WHERE username = ?', [value])
      .then(([user]) => {
        if (user.length > 0) {
          return Promise.reject('Username already in use');
        }
      });
  }),
  body('birthday', 'Birthday is required').exists().toDate(),
  body('gender', 'Gender is required').exists().isIn(['male', 'female', 'others']).withMessage('Gender invalid')
], registerController);

module.exports = router;