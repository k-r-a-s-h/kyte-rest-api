const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const loginController = require('../controllers/loginController');

router.post('/', [
    body('email', 'Email is required').exists().isEmail().withMessage('Invalid email'),
    body('password', 'Password is required').exists().isLength({ min: 5, max: 20}).withMessage('Invalid password')
], loginController);

module.exports = router;