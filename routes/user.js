const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/isAuthenticated');
const userController = require('../controllers/userController');

router.post('/getuser', isAuth, [
    body('id', 'User id is required').exists()
], userController.getUser);

router.post('/getallusers', isAuth, userController.getAllUsers);

router.post('/getfriends', isAuth, userController.getFriends);

router.post('/sendrequest', isAuth, [
    body('id', 'User id is required').exists()
], userController.sendRequest);

router.post('/getrequests', isAuth, userController.getRequests);

router.post('/acceptrequest', isAuth, [
    body('relId', 'Relation id is required').exists()
], userController.acceptRequest);

router.post('/rejectrequest', isAuth, [
    body('relId', 'Relation id is required').exists()
], userController.rejectRequest);

router.post('/getnotifications', isAuth, userController.getNotifications);

module.exports = router;