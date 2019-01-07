const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/isAuthenticated');
const getId = require('../middlewares/getId');
const getRelation = require('../middlewares/getRelation');
const canModify  = require('../middlewares/canModifyPost');
const getPosterId  = require('../middlewares/getPosterId');
const postController = require('../controllers/postController');

router.post('/save', isAuth, [
    body('post', 'Post cannot be empty').exists(),
    body('public', 'public field is required').exists()
], postController.savePost);

router.post('/delete', isAuth, [
    body('postId', 'post id is required').exists()
], canModify, postController.deletePost);

router.post('/like', isAuth, [
    body('postId', 'post id is required').exists()
], postController.likePost);

router.post('/getpost', isAuth, [
    body('postId', 'post id is required').exists()
 ], getPosterId, getRelation, postController.getPost);

router.post('/getposts', isAuth, [
    body('username', 'username is required').exists().isAlphanumeric().withMessage('Username should be alpha-numeric')
 ], getId, getRelation, postController.getPosts);

router.post('/getfriendposts', isAuth, postController.getFriendPosts);

module.exports = router;