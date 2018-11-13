const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/isAuthenticated');
const postController = require('../controllers/postController');

router.post('/save', isAuth, [
    body('post', 'Post cannot be empty').exists(),
    body('public', 'Public field is required').exists()
], postController.savePost);

router.post('/getposts', isAuth, postController.getPosts);

router.post('/getfriendposts', isAuth, postController.getFriendPosts);

router.post('/likepost', isAuth, [
    body('postId', 'Post id is required').exists()
], postController.likePost);

module.exports = router;