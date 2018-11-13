const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
require('dotenv').config();

const db = require('../util/database');

const loginController = async (req, res, next) => {
    const errors = validationResult(req);
    let user;
    if (!errors.isEmpty()) {
        res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        [user] = await db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
        if (user.length === 0) {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    }
    catch (error) {
        next(new Error(error));
    }
    try {
        const result = await bcrypt.compare(req.body.password, user[0].password);
        if (result === true) {
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0].id
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