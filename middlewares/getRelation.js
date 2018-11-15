const db = require('../util/database');

const getRelation = async (req, res, next) => {
    try {
        const sm = (req.userId > req.u_id) ? req.u_id : req.userId;
        const gt = (req.userId < req.u_id) ? req.u_id : req.userId;
        if (sm === gt) {
            req.relation = -1;
            return next();
        }
        const [result] = await db.execute('SELECT status FROM relationships WHERE user_one = ? and user_two = ?', [sm, gt]);
        req.relation = result.length > 0 ? result[0].status : -2;
        next();
    }
    catch (error) {
        new Error(error);
    }
}

module.exports = getRelation;