const db = require('../util/database');

const getRelation = async (req, res, next) => {
    try {
        const sm = (req.userId > req.u_id) ? req.u_id : req.userId;
        const gt = (req.userId < req.u_id) ? req.u_id : req.userId;
        if (sm === gt) {
            req.relation = -1;
            return next();
        }
        const [result] = await db.execute('SELECT id, status, action_user FROM relationships WHERE user_one = ? and user_two = ?', [sm, gt]);
        req.relId = result.length > 0 ? result[0].id : 0;
        req.relation = result.length > 0 ? result[0].status : -2;
        req.actionUser = result.length > 0 ? result[0].action_user : 0;
        next();
    }
    catch (error) {
        new Error(error);
    }
}

module.exports = getRelation;