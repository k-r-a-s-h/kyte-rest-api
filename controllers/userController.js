const { validationResult } = require('express-validator/check');

const db = require('../util/database');

const getUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: errors.array()[0].msg });
    }
    if (req.body.id === -1) {
        req.body.id = req.userId;
    }
    try {
        const [user] = await db.execute('SELECT id, email, username, image, name, birthday, gender FROM users WHERE id = ?', [req.body.id]);
        res.status(200).json({ user: user[0] || [] });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const [users] = await db.execute('SELECT id, email, username, image, name, birthday, gender FROM users WHERE id <> ?', [req.userId]);
        res.status(200).json({ users: users });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getFriends = async (req, res, next) => {
    try {
        const [friends] = await db.execute('SELECT id, email, username, image, name, birthday, gender FROM users WHERE id IN (SELECT user_one FROM relationships WHERE user_two = ? AND status = 1 UNION SELECT user_two from relationships WHERE user_one = ? AND status = 1)', [req.userId, req.userId]);
        res.status(200).json({ friends: friends });
    }
    catch (error) {
        next(new Error(error));
    }
}

const sendRequest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: errors.array()[0].msg });
    }
    try {
        const sm = (req.userId > req.body.id) ? req.body.id : req.userId;
        const gt = (req.userId < req.body.id) ? req.body.id : req.userId;
        const [status] = await db.execute('SELECT status FROM relationships WHERE user_one = ? AND user_two = ?', [sm, gt]);
        if (status.length > 0) {
            return res.status(400).json({ msg: 'Request cannot be sent' });
        }
        const [result] = await db.execute('INSERT INTO relationships (user_one, user_two, status, action_user, r_date) values (?, ?, ?, ?, ?)', [
            sm, gt, 0, req.userId, new Date().toISOString().split('.')[0]
        ]);
        res.status(200).json({ msg: 'Request sent' });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getRequests = async (req, res, next) => {
    try {
        const [result] = await db.execute('SELECT * FROM relationships WHERE ((user_one = ? OR user_two = ?) AND status = 0 AND action_user = ?)', [req.userId, req.userId, req.userId]);
        res.status(200).json({ requests: result });
    }
    catch (error) {
        next(new Error(error));
    }
}

const acceptRequest = async (req, res, next) => {
    try {
        const [result] = await db.execute('UPDATE relationships SET status = 1, action_user = ? WHERE id = ?', [req.userId, req.body.relId]);
        res.status(200).json({ msg: 'Accepted' });
    }
    catch (error) {
        next(new Error(error));
    }
}

const rejectRequest = async (req, res, next) => {
    try {
        const [result] = await db.execute('DELETE FROM relationships WHERE id = ?', [req.body.relId]);
        res.status(200).json({ msg: 'Rejected' });
    }
    catch (error) {
        next(new Error(error));
    }
}

const getNotifications = async (req, res, next) => {
    try {
        const [notis] = await db.execute('SELECT * FROM notifications WHERE u_id = ?', [req.userId]);
        res.status(200).json({ notifications: notis });
    }
    catch (error) {
        next(new Error(error));
    }
}

module.exports = {
    getUser,
    getAllUsers,
    getFriends,
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest,
    getNotifications
};