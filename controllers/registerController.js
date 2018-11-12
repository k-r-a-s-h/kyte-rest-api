const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const saltRounds = 12;

registerController = async (req, res, next) => {
    const errors = validationResult(req);
    let hash;
    if (!errors.isEmpty()) {
        res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        hash = await bcrypt.hash(req.body.password, saltRounds);
    }
    catch (error) {
        next(new Error(error));
    }
    try {
        const result = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            image: 'https://w3schools.com/w3images/avatar3.png',
            password: hash,
            birthday: req.body.birthday,
            gender: req.body.gender
        });
        res.status(200).json({ msg: "User registered" });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = registerController;