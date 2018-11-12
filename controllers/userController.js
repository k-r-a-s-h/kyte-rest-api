const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const getUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ msg: errors.array()[0].msg });
    }
    if (req.body.id === -1) {
        req.body.id = req.userId;
    }
    try {
        const user = await User.findOne({ where: { id: req.body.id } });
        res.status(200).json({ user: user });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ where: { id: { $ne: req.userId } } });
        res.status(200).json({ users: users });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = {
    getUser,
    getAllUsers
};