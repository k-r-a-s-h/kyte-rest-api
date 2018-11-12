const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
require('dotenv').config();

const User = require('../models/user');

const loginController = async (req, res, next) => {
    const errors = validationResult(req);
    let user;
    if (!errors.isEmpty()) {
        res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        user = await User.findOne({ where: { email: req.body.email }});
        if (!user) {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    }
    catch (error) {
        next(new Error(error));
    }
    try {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result === true) {
            const token = jwt.sign({
                email: user.email,
                userId: user.id
            }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.status(200).json({ msg: "logged in", token: token });
        }
        else {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = loginController;