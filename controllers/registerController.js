const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');

const db = require('../util/database');;
const saltRounds = 12;

registerController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const result = await db.execute('INSERT INTO users (name, email, username, image, password, birthday, gender) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.name, req.body.email, req.body.username, 'https://w3schools.com/w3images/avatar3.png', hash, req.body.birthday, req.body.gender]);
        res.status(200).json({ msg: "User registered" });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = registerController;