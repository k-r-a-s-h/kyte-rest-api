const Post = require('../models/post');

const savePost = async (req, res, next) => {
    try {
        const result = await Post.create({
            p_id: req.userId,
            post: req.body.post,
            public: req.body.public
        });
        res.status(200).json({ msg: "Post saved" });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getPosts = async (req, res, next) => {
    try {
        const result = await Post.findAll({where: {p_id: req.userId}});
        res.status(200).json({ posts: result });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = {
    savePost,
    getPosts
};