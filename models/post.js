const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    p_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    post: {
        type: Sequelize.STRING(10000),
        allowNull: false
    },
    public: {
        type: Sequelize.CHAR,
        allowNull: false
    }
});

module.exports = Post;