const { validationResult } = require('express-validator/check');

const db = require('../util/database');

const savePost = async (req, res, next) => {
    try {
        const result = await db.execute('INSERT INTO posts (po_id, post, public) VALUES (?, ?, ?)', [
            req.userId,
            req.body.post,
            req.body.public
        ]);
        res.status(200).json({ msg: "Post saved" });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getPosts = async (req, res, next) => {
    try {
        const [post] = await db.execute('SELECT * FROM posts where po_id = ?', [req.userId]);
        res.status(200).json({ posts: post });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getFriendPosts = async (req, res, next) => {
    try {
        const [posts] = await db.execute('SELECT posts.id AS p_id, po_id AS u_id, username, name, image, posts.updatedAt, post, public FROM posts JOIN users ON (posts.po_id = users.id) WHERE po_id IN (SELECT user_one FROM relationships WHERE user_two = ? AND status = 1 UNION SELECT user_two from relationships WHERE user_one = ? AND status = 1)', [req.userId, req.userId]);
        res.status(200).json({ posts: posts });
    }
    catch (error) {
        next(new Error(error));
    }
}

const likePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        const [user] = await db.execute('SELECT name FROM users where id = ?', [req.userId]);
        const notif = user[0].name + ' has liked your post';
        const [result] = await db.execute('CALL likePost(?, ?, ?)', [req.body.postId, req.userId, notif]);
        res.status(200).json({ msg: 'liked/unliked' });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = {
    savePost,
    getPosts,
    getFriendPosts,
    likePost
};