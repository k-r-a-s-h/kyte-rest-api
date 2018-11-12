const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/isAuthenticated');
const userController = require('../controllers/userController');

router.post('/getuser', isAuth, [
    body('id', 'User id is required').exists()
], userController.getUser);

router.post('/getallusers', isAuth, userController.getAllUsers);

module.exports = router;